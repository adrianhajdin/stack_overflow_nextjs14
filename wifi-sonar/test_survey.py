"""End-to-end check of the survey pipeline against a simulated controller.

Builds a fake house: 3 APs, a set of rock-steady static devices (good link
anchors), some drifty ones (too noisy to be useful), and one slow-refreshing
device. Then asserts the survey classifies each correctly.
"""

import random

from wifisonar.survey import HUMAN_CROSSING_DB, report, run_survey

random.seed(1)

APS = [
    {"type": "uap", "mac": "aa:00:00:00:00:01", "name": "Living Room AP"},
    {"type": "uap", "mac": "aa:00:00:00:00:02", "name": "Upstairs AP"},
    {"type": "uap", "mac": "aa:00:00:00:00:03", "name": "Garage AP"},
    {"type": "usw", "mac": "bb:00:00:00:00:01", "name": "Switch (ignored)"},
]

# (name, base rssi, idle sigma dB, refresh every N polls)
PROFILE = [
    ("smart-tv",        -52, 0.4, 1), ("thermostat",   -61, 0.3, 1),
    ("echo-kitchen",    -58, 0.5, 1), ("printer",      -70, 0.6, 1),
    ("smartplug-lamp",  -55, 0.4, 1), ("doorbell-cam", -74, 0.7, 1),
    ("nas",             -48, 0.3, 1), ("bulb-hallway", -66, 0.5, 1),
    ("bulb-bedroom",    -68, 0.6, 1), ("roku",         -57, 0.4, 1),
    ("air-purifier",    -63, 0.5, 1), ("garage-opener",-77, 0.8, 1),
    ("phone-mobile",    -60, 6.0, 1),   # carried around: far too noisy
    ("laptop-roaming",  -55, 5.2, 1),   # ditto
    ("sensor-slow",     -72, 0.4, 40),  # only refreshes every 40 polls
]


class FakeClient:
    """Stands in for UniFiClient with the same two methods survey.py calls."""

    def __init__(self):
        self.poll = 0
        self._last = {}

    def devices(self):
        return APS

    def clients(self):
        self.poll += 1
        out = [{"mac": "wired-1", "is_wired": True, "name": "desktop"}]
        for i, (name, base, sigma, every) in enumerate(PROFILE):
            mac = f"cc:00:00:00:00:{i:02x}"
            if self.poll % every == 0 or mac not in self._last:
                # RSSI is integer-quantized by the hardware.
                self._last[mac] = round(random.gauss(base, sigma))
            out.append({
                "mac": mac,
                "name": name,
                "is_wired": False,
                "rssi": self._last[mac],
                "ap_mac": APS[i % 3]["mac"],
            })
        return out


# Run fast: 60 "seconds" at zero interval so it completes instantly.
result = run_survey(FakeClient(), duration=2.0, interval=0.02)
report(result)

links = result["links"]
by_name = {l.name: l for l in links.values()}

print("\n" + "=" * 74)
print("  ASSERTIONS")
print("=" * 74)

failures = []

def check(label, cond):
    print(f"  [{'PASS' if cond else 'FAIL'}] {label}")
    if not cond:
        failures.append(label)

check("wired client excluded", "desktop" not in by_name)
check("all 15 wireless clients tracked", len(links) == 15)
check("APs counted, switch excluded", len(result["aps"]) == 3)
check("static smart-tv is usable", by_name["smart-tv"].usable)
check("static thermostat is usable", by_name["thermostat"].usable)
check("roaming phone rejected as noisy", not by_name["phone-mobile"].usable)
check("roaming laptop rejected as noisy", not by_name["laptop-roaming"].usable)
check(f"phone sigma exceeds {HUMAN_CROSSING_DB}dB threshold",
      by_name["phone-mobile"].sigma >= HUMAN_CROSSING_DB)
check("slow sensor has near-zero refresh rate",
      by_name["sensor-slow"].refresh_hz < by_name["smart-tv"].refresh_hz / 10)
check("13 static devices judged usable",
      sum(1 for l in links.values() if l.usable) == 13)

print()
if failures:
    print(f"  {len(failures)} FAILURE(S): {failures}")
    raise SystemExit(1)
print("  all assertions passed")
