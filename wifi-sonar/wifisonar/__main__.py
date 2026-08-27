"""CLI entry point:  python3 -m wifisonar survey --host 192.168.1.1 -u admin"""

from __future__ import annotations

import argparse
import getpass
import os
import sys

from .survey import report, run_survey
from .unifi import UniFiClient, UniFiError


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="wifisonar",
        description="Map a house from WiFi radio measurements.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    s = sub.add_parser("survey", help="measure whether your UniFi setup can support imaging")
    s.add_argument("--host", required=True,
                   help="controller address, e.g. 192.168.1.1 or unifi.lan:8443")
    s.add_argument("-u", "--username", required=True,
                   help="LOCAL controller account (not Ubiquiti SSO), 2FA disabled")
    s.add_argument("--site", default="default", help="UniFi site name (default: default)")
    s.add_argument("--duration", type=float, default=180.0,
                   help="survey length in seconds (default: 180)")
    s.add_argument("--interval", type=float, default=3.0,
                   help="poll interval in seconds (default: 3)")
    s.add_argument("--verify-tls", action="store_true",
                   help="verify the controller certificate (fails on stock self-signed certs)")

    args = parser.parse_args(argv)

    password = os.environ.get("UNIFI_PASSWORD")
    if not password:
        password = getpass.getpass(f"UniFi password for {args.username}: ")

    client = UniFiClient(
        host=args.host,
        username=args.username,
        password=password,
        site=args.site,
        verify=args.verify_tls,
    )

    try:
        print(f"  connecting to {args.host} ...")
        client.login()
        print(f"  logged in ({'UniFi OS' if client.unifi_os else 'classic controller'}), "
              f"site '{args.site}'")
        result = run_survey(client, duration=args.duration, interval=args.interval)
    except UniFiError as exc:
        print(f"\nerror: {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\ninterrupted", file=sys.stderr)
        return 130

    report(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
