# Legenda Jawa Timur — Webbook

Static webbook: cinematic opening, a clickable main book, table of contents, and cover-only legend pages. The full text intentionally is not included yet.

Build web assets:

```powershell
$env:PYTHONPATH = (Join-Path (Get-Location) '.build_deps')
& 'C:\Users\ROG ALLY\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' webbook\scripts\prepare_assets.py
```

Serve locally:

```powershell
Set-Location webbook
python -m http.server 4173
```
