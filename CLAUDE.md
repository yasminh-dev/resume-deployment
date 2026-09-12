# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Jekyll resume site hosted on GitHub Pages at https://yasminh-dev.github.io/resume-deployment/, with two pages sharing one content source:

- **`/`** (`index.md`) — the plain, ATS-parseable resume. Rendered through the `jekyll-theme-slate` theme, with `assets/css/resume.css` overriding the theme to produce a plain layout (hides the theme's header/footer chrome, left-aligns everything, caps content width at 900px). This is the canonical page for job applications — keep it linear, text-first, and ATS-friendly.
- **`/interactive/`** (`interactive/index.html`) — a side-scrolling, kaiju-themed portfolio/demo showcase of the same resume content (inspired by rleonardi.com/interactive-resume/, scaled down). It uses its own layout (`_layouts/kaiju.html`) that bypasses `jekyll-theme-slate` entirely, its own stylesheet (`assets/css/kaiju.css`), and vanilla JS (`assets/js/kaiju.js`) for wheel-to-horizontal scrolling, scroll-driven parallax, and keyboard navigation. It is a demonstration piece, not a replacement for `/` — it links back to the plain resume and is not what should go on job applications (a scroll-jacked page is not ATS-parseable). The visual theme is an original kaiju silhouette and generic "giant-monster" language — deliberately not "Godzilla" or "Rampage" branding/likeness, since both are trademarked/copyrighted properties.

Both pages render from **`_data/resume.yml`**, the single structured source of truth for resume content (contact info, summary, skills, experience, additional experience, education). Edit content there, not by hand-editing the Liquid loops in `index.md` or `interactive/index.html` — this keeps the two pages from drifting out of sync.

## Commands

Build/serve locally (bundler installs gems into `vendor/bundle` per `.bundle/config`):

```bash
bundle install
bundle exec jekyll serve   # local preview at http://localhost:4000
bundle exec jekyll build   # outputs to _site/
```

There are no tests, linters, or CI checks in this repo — `.github/` contains only `copilot-instructions.md`, no workflows.

### Publishing

GitHub Pages builds `main` automatically on push — there is no separate deploy step. Two helper scripts exist for pushing from environments without an interactive git credential setup:

- `scripts/push_to_github.sh` — ensures the SSH agent has `~/.ssh/id_ed25519` loaded, then `git push origin main`.
- `scripts/push_resume.py` — requires `GITHUB_PAT` env var; calls `scripts/github_auth.py --token ... --test` (stores an HTTPS credential in `~/.git-credentials` and sets global git user config) then pushes `main`.
- `scripts/github_auth.py` — standalone auth setup/test tool (`--ssh` to configure the SSH remote and test connectivity instead of PAT/HTTPS; `--clear` to remove stored PAT credentials).

Never commit a `GITHUB_PAT` value or the contents of `~/.git-credentials`.

## Editing the resume

- **Content**: edit `_data/resume.yml` (contact, summary, skills, experience array, additional experience, education). Both `index.md` and `interactive/index.html` loop over this data via Liquid — don't hand-edit resume text directly in either page's markup, or the two pages will drift out of sync.
- `globalinstruction.md` and `.github/copilot-instructions.md` both encode the same content guidance and should be treated as the style contract for resume edits: keep bullets concise, outcome-oriented, and measurable; frame internal/enterprise work in business-facing language aligned to SDE II-level scope; emphasize backend engineering, APIs/API docs, Kubernetes/OpenShift, secrets/security (HashiCorp Vault), CI/CD, and production support; avoid fluff; keep formatting ATS-friendly. This governs `_data/resume.yml`'s content specifically.
- **`/` styling**: `_config.yml` sets the Jekyll theme (`jekyll-theme-slate`) and site title. `assets/css/resume.css` is the styling layer for `index.md` only — any visual/layout change to the plain resume goes there, using `!important` overrides consistently with the existing rules since they override theme defaults.
- **`/interactive/` styling**: `assets/css/kaiju.css` is a fully independent stylesheet with no theme to override (no `!important` needed) — it's loaded by `_layouts/kaiju.html`, which bypasses the slate theme entirely. Interaction logic lives in `assets/js/kaiju.js` (progressive enhancement — the page must stay a readable, linear document with JS disabled; respects `prefers-reduced-motion` and falls back to a normal vertical stack below the 768px breakpoint).
- `_site/`, `vendor/`, `.bundle/`, and `.idea/` are build/tooling output and are not (yet) gitignored — avoid committing changes under these unless intentionally updating tracked build output.
