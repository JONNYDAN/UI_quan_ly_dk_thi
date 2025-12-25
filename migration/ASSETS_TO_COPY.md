Please copy these assets from `xettuyen2025_frontend` to `UI_HCMUE_XetTuyen/public`:

- `xettuyen2025_frontend/public/logo_hcmue.png` -> `UI_HCMUE_XetTuyen/public/logo_hcmue.png`
- Any images under `xettuyen2025_frontend/src/resources/images/` that are referenced by migrated components (logos, exam images, etc.) -> copy to `UI_HCMUE_XetTuyen/public/assets/images/` or `UI_HCMUE_XetTuyen/public/` as appropriate.

Notes:
- Some components reference `/logo_hcmue.png` in QR generation and image settings — ensure that file is available at `UI_HCMUE_XetTuyen/public/logo_hcmue.png`.
- After copying, re-run the dev server and verify images load correctly.
