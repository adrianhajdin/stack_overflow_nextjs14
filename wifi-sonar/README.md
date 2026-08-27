# wifi-sonar

Mapping a house from WiFi radio measurements, starting with the UniFi gear
you already own.

## Read this before you get your hopes up

**WiFi cannot echo-range your walls.** Sonar works by timing echoes, and range
resolution is `c / (2B)` where `B` is bandwidth. WiFi at 40 MHz gives you
**3.75 m** resolution -- coarser than a room. At 80 MHz it is 1.9 m. No amount
of software fixes this; it is the bandwidth. (60 GHz 802.11ad imaging works
because it has 2 GHz of bandwidth -> 7.5 cm.)

What *does* work on commodity hardware is **radio tomography**: measure
attenuation across many transmitter/receiver links, then invert that onto a
voxel grid. CT-scan math, not sonar math. You get an occupancy heatmap. You do
not get walls.

## What UniFi can and cannot give you

| Source | Data | Rate | Verdict |
|---|---|---|---|
| Controller API `/stat/sta` | RSSI, one value per associated client | ~0.03-0.2 Hz | Works, coarse |
| SSH to AP + `tcpdump` monitor mode | Per-packet RSSI, radiotap, all devices in range | ~100 Hz | Much better |
| CSI (per-subcarrier amplitude/phase) | -- | -- | **Not exposed by UniFi** |

UniFi APs run locked Qualcomm/MediaTek firmware with no CSI export path. You
get **one number per packet** (RSSI) instead of the ~64 complex numbers per
packet an ESP32 gives you. That is the whole difference between a 1-pixel
sensor and a 64-pixel one.

The saving grace: tomography needs *many links*, not rich ones. Every AP paired
with a stationary device (TV, thermostat, smart plug, printer, doorbell) is a
fixed link crossing your house. A person walking through one dips its RSSI by
roughly 2-6 dB.

## Step 1: measure your house

Whether this works for *you* depends on how many stationary devices you have
and how chatty they are. Find out before writing a solver:

```bash
cd wifi-sonar
export UNIFI_PASSWORD='...'          # keeps it out of your shell history
python3 -m wifisonar survey --host 192.168.1.1 -u your-local-admin
```

Use a **local** controller account with 2FA disabled -- Ubiquiti SSO/cloud
logins will not authenticate against the local API.

The survey polls for three minutes and reports, per link, the mean RSSI, the
idle standard deviation, and the true refresh rate. The **idle sigma** is the
number that decides everything: a person crossing a link moves it ~3 dB, so any
link whose idle noise is already 3 dB is blind and is dead weight in a solver.

Roughly 12+ usable links gets you coarse occupancy imaging. Fewer than that
gets you "someone is home".

### TLS note

UniFi controllers ship self-signed certificates, so verification cannot succeed
against a LAN console; the client skips it by default. That is only acceptable
because you are addressing a device on your own LAN by IP. Pass `--verify-tls`
if you have installed a real certificate.

## Where this goes next

Driven by what the survey finds:

1. **Enough links** -> build the inverse solver (regularized least squares over
   a voxel grid) and a live heatmap.
2. **Too few links** -> either capture in monitor mode on the APs directly
   (turns N links into APs x devices), or add ESP32 CSI nodes at ~$5 each for
   genuine per-subcarrier data.

## Testing

```bash
python3 test_survey.py
```

Runs the full survey pipeline against a simulated 3-AP house with known static,
roaming, and slow-refreshing devices, and asserts each is classified correctly.
