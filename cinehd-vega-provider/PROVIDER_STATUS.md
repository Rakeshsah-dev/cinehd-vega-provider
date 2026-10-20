# Provider status — CineHD / Vega

## Implemented in this repository
- [x] Standalone Vega provider repository layout and manifest
- [x] Provider functions matching Vega's provider-template signatures
- [x] Public navigation routes based on the current CineHD web player pages
- [x] Best-effort HTML card and metadata parsing
- [x] Best-effort episode link parsing
- [x] Settings for the base website URL
- [x] GitHub Actions workflow to build and commit `dist/` bundles

## Not yet verified / blockers to a fully working provider
- [ ] CineHD's result list is client-rendered; the public HTML inspected shows an app shell rather than result cards
- [ ] No documented/authorized public catalog API has been verified
- [ ] No documented/authorized direct playback endpoint has been verified
- [ ] No live Vega app end-to-end test has been performed

**Do not describe this package as fully functional yet.** A successful bundle build only verifies packaging; it does not prove the website parser or playback works. Completing the remaining items requires an authorized API/interface or sample HTML/response and media URLs that the service permits this provider to use.
