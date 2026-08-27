"""Minimal UniFi Network controller client.

Stdlib only, so this runs on a stock Python 3.9+ with nothing installed.
Handles both controller generations:

  * UniFi OS consoles (UDM / UDM-Pro / UDR / Cloud Key Gen2+, port 443)
      login  -> POST /api/auth/login          (TOKEN cookie + X-CSRF-Token)
      api    -> /proxy/network/api/s/<site>/...
  * Classic self-hosted controllers (port 8443)
      login  -> POST /api/login               (unifises cookie)
      api    -> /api/s/<site>/...

TLS: UniFi controllers ship self-signed certificates, so certificate
verification cannot succeed against a LAN console. `verify=False` (the
default) skips it. That is acceptable here only because the target is a
device on your own LAN addressed by IP; never point this at a host you
do not physically control.
"""

from __future__ import annotations

import http.cookiejar
import json
import ssl
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


class UniFiError(RuntimeError):
    pass


class UniFiClient:
    def __init__(
        self,
        host: str,
        username: str,
        password: str,
        site: str = "default",
        verify: bool = False,
        timeout: float = 15.0,
    ) -> None:
        if "://" not in host:
            host = "https://" + host
        self.base = host.rstrip("/")
        self.username = username
        self.password = password
        self.site = site
        self.timeout = timeout
        self.unifi_os = False
        self._csrf: str | None = None

        ctx = ssl.create_default_context()
        if not verify:
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE

        self._jar = http.cookiejar.CookieJar()
        self._opener = urllib.request.build_opener(
            urllib.request.HTTPSHandler(context=ctx),
            urllib.request.HTTPCookieProcessor(self._jar),
        )

    # ---------------------------------------------------------------- http

    def _raw(self, method: str, path: str, body: dict | None = None) -> tuple[int, bytes, dict]:
        url = self.base + path
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(url, data=data, method=method)
        req.add_header("Content-Type", "application/json")
        req.add_header("Accept", "application/json")
        if self._csrf:
            req.add_header("X-CSRF-Token", self._csrf)
        try:
            with self._opener.open(req, timeout=self.timeout) as resp:
                return resp.status, resp.read(), dict(resp.headers)
        except urllib.error.HTTPError as exc:
            return exc.code, exc.read(), dict(exc.headers or {})
        except urllib.error.URLError as exc:
            raise UniFiError(f"cannot reach {url}: {exc.reason}") from exc

    # --------------------------------------------------------------- login

    def login(self) -> None:
        """Authenticate, auto-detecting the controller generation."""
        # UniFi OS first: it is what almost every current console runs.
        status, raw, headers = self._raw(
            "POST", "/api/auth/login", {"username": self.username, "password": self.password}
        )
        if status == 200:
            self.unifi_os = True
            self._csrf = headers.get("X-CSRF-Token") or headers.get("x-csrf-token")
            if not self._csrf:
                for cookie in self._jar:
                    if cookie.name.upper() == "TOKEN":
                        self._csrf = _csrf_from_jwt(cookie.value)
                        break
            return

        if status in (401, 403):
            raise UniFiError(
                "UniFi OS rejected those credentials (401/403). Use a local "
                "controller account, not your Ubiquiti SSO/cloud login, and "
                "make sure 2FA is off for that account."
            )

        # Fall back to the classic controller.
        status, raw, _ = self._raw(
            "POST", "/api/login", {"username": self.username, "password": self.password}
        )
        if status == 200:
            self.unifi_os = False
            return
        if status in (401, 403):
            raise UniFiError("classic controller rejected those credentials (401/403)")
        raise UniFiError(f"login failed: HTTP {status}: {raw[:200]!r}")

    # ----------------------------------------------------------------- api

    def _api(self, endpoint: str) -> list[dict[str, Any]]:
        prefix = "/proxy/network" if self.unifi_os else ""
        path = f"{prefix}/api/s/{urllib.parse.quote(self.site)}/{endpoint.lstrip('/')}"
        status, raw, _ = self._raw("GET", path)
        if status != 200:
            raise UniFiError(f"GET {path} -> HTTP {status}: {raw[:200]!r}")
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise UniFiError(f"GET {path} returned non-JSON: {raw[:200]!r}") from exc
        data = payload.get("data")
        if data is None:
            raise UniFiError(f"GET {path} returned no data key: {payload}")
        return data

    def devices(self) -> list[dict[str, Any]]:
        """UniFi-managed hardware: APs, switches, gateways."""
        return self._api("stat/device")

    def clients(self) -> list[dict[str, Any]]:
        """Currently-connected clients, wired and wireless."""
        return self._api("stat/sta")

    def sites(self) -> list[dict[str, Any]]:
        prefix = "/proxy/network" if self.unifi_os else ""
        status, raw, _ = self._raw("GET", f"{prefix}/api/self/sites")
        if status != 200:
            raise UniFiError(f"cannot list sites: HTTP {status}")
        return json.loads(raw).get("data", [])


def _csrf_from_jwt(token: str) -> str | None:
    """UniFi OS embeds the CSRF token in the TOKEN cookie's JWT payload."""
    import base64

    parts = token.split(".")
    if len(parts) < 2:
        return None
    payload = parts[1]
    payload += "=" * (-len(payload) % 4)
    try:
        return json.loads(base64.urlsafe_b64decode(payload)).get("csrfToken")
    except Exception:
        return None
