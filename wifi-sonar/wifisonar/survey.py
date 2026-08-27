"""Feasibility survey: can this house be mapped from UniFi RSSI alone?

Tomography needs *links* -- transmitter/receiver pairs whose signal a person
can walk through and disturb. This polls the controller for a few minutes and
measures what you actually have to work with:

  * how many APs are online
  * how many wireless clients are physically stationary (usable link anchors)
  * how fast each link's RSSI actually refreshes
  * how much each link's RSSI wanders when nothing is happening (the noise
    floor you must beat to detect a person)

The last number is the one that decides the project. A person crossing a link
moves its RSSI by roughly 2-6 dB. If a link's idle standard deviation is
already 4 dB, that link cannot see people and is dead weight in the solver.
"""

from __future__ import annotations

import statistics
import sys
import time
from dataclasses import dataclass, field

from .unifi import UniFiClient

# A human body crossing the line-of-sight of a 2.4/5 GHz link attenuates it by
# roughly this much. Measured repeatedly in the radio-tomographic-imaging
# literature (Wilson & Patwari 2010 and successors); treat as an order of
# magnitude, not a constant.
HUMAN_CROSSING_DB = 3.0

# Below this many usable links, an inverse solver is underdetermined to the
# point of uselessness for anything beyond "someone is home".
MIN_LINKS_FOR_IMAGING = 12


@dataclass
class LinkStats:
    mac: str
    name: str
    ap: str
    rssi: list[float] = field(default_factory=list)
    change_times: list[float] = field(default_factory=list)

    @property
    def n(self) -> int:
        return len(self.rssi)

    @property
    def mean(self) -> float:
        return statistics.fmean(self.rssi) if self.rssi else float("nan")

    @property
    def sigma(self) -> float:
        """Idle standard deviation in dB -- the noise floor of this link."""
        return statistics.stdev(self.rssi) if len(self.rssi) > 1 else 0.0

    @property
    def refresh_hz(self) -> float:
        """How often the controller actually gives us a *new* value."""
        if len(self.change_times) < 2:
            return 0.0
        span = self.change_times[-1] - self.change_times[0]
        return (len(self.change_times) - 1) / span if span > 0 else 0.0

    @property
    def usable(self) -> bool:
        """Can a person crossing this link be distinguished from idle drift?"""
        return self.n >= 5 and 0 < self.sigma < HUMAN_CROSSING_DB and self.refresh_hz > 0


def run_survey(client: UniFiClient, duration: float, interval: float) -> dict:
    links: dict[str, LinkStats] = {}
    aps: dict[str, str] = {}

    for dev in client.devices():
        if dev.get("type") == "uap":
            aps[dev.get("mac", "")] = dev.get("name") or dev.get("model") or "unnamed AP"

    if not aps:
        print("  ! no access points found on this site", file=sys.stderr)

    started = time.monotonic()
    polls = 0
    last_draw = -1.0
    while time.monotonic() - started < duration:
        now = time.monotonic()
        for sta in client.clients():
            if sta.get("is_wired") or "rssi" not in sta:
                continue
            mac = sta.get("mac", "")
            link = links.get(mac)
            if link is None:
                link = LinkStats(
                    mac=mac,
                    name=(sta.get("name") or sta.get("hostname") or sta.get("oui") or mac),
                    ap=aps.get(sta.get("ap_mac", ""), "?"),
                )
                links[mac] = link
            rssi = float(sta["rssi"])
            # The controller repeats a cached value between its own refreshes;
            # only a changed value is genuinely new information.
            if not link.rssi or rssi != link.rssi[-1]:
                link.change_times.append(now)
            link.rssi.append(rssi)
        polls += 1
        elapsed = time.monotonic() - started
        # Redraw at most once a second, and only onto a terminal -- otherwise
        # a fast loop floods logs and CI output with thousands of lines.
        if sys.stdout.isatty() and elapsed - last_draw >= 1.0:
            last_draw = elapsed
            print(
                f"\r  polling... {elapsed:5.0f}s / {duration:.0f}s  "
                f"({polls} polls, {len(links)} wireless clients)",
                end="",
                flush=True,
            )
        remaining = interval - (time.monotonic() - now)
        if remaining > 0:
            time.sleep(remaining)
    if sys.stdout.isatty():
        print()

    return {"aps": aps, "links": links, "polls": polls, "duration": time.monotonic() - started}


def report(result: dict) -> None:
    aps: dict[str, str] = result["aps"]
    links: dict[str, LinkStats] = result["links"]

    ordered = sorted(links.values(), key=lambda l: (not l.usable, l.sigma))
    usable = [l for l in ordered if l.usable]

    print()
    print("=" * 74)
    print(f"  ACCESS POINTS: {len(aps)}")
    for name in sorted(aps.values()):
        print(f"    - {name}")

    print()
    print(f"  WIRELESS CLIENTS: {len(links)}   (survey ran {result['duration']:.0f}s, "
          f"{result['polls']} polls)")
    print()
    print(f"  {'client':<26} {'AP':<14} {'RSSI':>6} {'sigma':>7} {'refresh':>9}  use")
    print(f"  {'-'*26} {'-'*14} {'-'*6} {'-'*7} {'-'*9}  ---")
    for l in ordered:
        flag = "yes" if l.usable else ("noisy" if l.sigma >= HUMAN_CROSSING_DB else "static")
        print(
            f"  {l.name[:26]:<26} {l.ap[:14]:<14} {l.mean:6.1f} "
            f"{l.sigma:6.2f}dB {l.refresh_hz:8.3f}Hz  {flag}"
        )

    print()
    print("=" * 74)
    print("  VERDICT")
    print("=" * 74)

    n_usable = len(usable)
    print(f"  Usable links via controller API : {n_usable}")
    print(f"  Potential links via AP monitor  : {len(aps) * len(links)}  "
          f"({len(aps)} APs x {len(links)} devices)")

    if usable:
        med_hz = statistics.median(l.refresh_hz for l in usable)
        med_sigma = statistics.median(l.sigma for l in usable)
        if med_hz > 0:
            print(f"  Median refresh rate             : {med_hz:.3f} Hz "
                  f"(one sample per {_duration(1 / med_hz)})")
        print(f"  Median idle noise               : {med_sigma:.2f} dB "
              f"vs ~{HUMAN_CROSSING_DB:.0f} dB for a person crossing")
    print()

    if n_usable >= MIN_LINKS_FOR_IMAGING:
        print(f"  -> {n_usable} usable links is enough for coarse occupancy imaging.")
        print("     Expect room-level blobs, not walls. Next step: solve the")
        print("     inverse problem on this link set.")
    elif n_usable > 0:
        print(f"  -> Only {n_usable} usable links (want {MIN_LINKS_FOR_IMAGING}+).")
        print("     Enough for 'is someone home' and rough room presence, not")
        print("     for a spatial map. Two ways up:")
        print("       a) SSH into the APs and capture in monitor mode -- turns")
        print(f"          {n_usable} links into up to {len(aps) * len(links)}.")
        print("       b) Add ESP32 CSI nodes for real per-subcarrier data.")
    else:
        print("  -> No usable links. Either the survey was too short, or every")
        print("     link's RSSI is too noisy/too slow to see a person.")

    slow = [l for l in ordered if 0 < l.refresh_hz < 0.05]
    if slow:
        print()
        print(f"  NOTE: {len(slow)} links refresh slower than once per 20s. The")
        print("        controller polls its APs on a fixed cycle; you cannot")
        print("        make this faster through the API. Monitor-mode capture")
        print("        on the AP itself is the only way to raise the rate.")


def _duration(seconds: float) -> str:
    """Human-readable interval; real controller links refresh every 5-30s,
    but a monitor-mode feed can be sub-second, so both ends need to read well."""
    if seconds < 1.0:
        return f"{seconds * 1000:.0f}ms"
    if seconds < 60.0:
        return f"{seconds:.1f}s"
    return f"{seconds / 60:.1f}min"
