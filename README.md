# florstorme portfolio

A static single-page portfolio. Plain HTML, CSS and one small JS file — no
framework, no build step, no dependencies. Open `index.html` in a browser and
it works.

```
index.html      all the content
styles.css      all the styling
main.js         hero pipeline animation + portrait fallback
assets/img/     your portrait  → flor.jpg
assets/cv/      your CV        → cv-flor-storme.pdf
```

## Two files to drop in

| Save as | Used by |
|---|---|
| `assets/img/flor.jpg` | About section portrait (crops to 4:5) |
| `assets/cv/cv-flor-storme.pdf` | "Download CV" button + Contact list |

Both paths are already wired up. Until the portrait exists the About section
shows a placeholder frame rather than a broken image.

## Preview locally

Double-clicking `index.html` is enough. To match how GitHub serves it:

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Publish to GitHub Pages

The goal is the clean root URL **https://pablostorme.github.io** — which
requires the repo to be named exactly `PabloStorme.github.io`.

**1. Rename the repo.** On github.com → the repo → *Settings* → *General* →
*Repository name* → change `portfolio` to `PabloStorme.github.io` → *Rename*.

> The `gh` CLI on this machine is signed in as a different account
> (`FlorHuman8`), so use the web UI unless you switch with `gh auth switch`.

**2. Point the local clone at the new name.**

```bash
git remote set-url origin https://github.com/PabloStorme/PabloStorme.github.io.git
git remote -v          # confirm
```

**3. Make sure the repo is public.** *Settings* → *General* → bottom of the
page → *Change visibility*. GitHub Pages on private repos needs a paid plan;
public is free.

**4. Push.**

```bash
git add -A
git commit -m "Portfolio site"
git push -u origin main
```

**5. Turn Pages on.** *Settings* → *Pages* → under *Build and deployment* set
*Source* to **Deploy from a branch**, *Branch* to **main** and folder to
**/ (root)** → *Save*.

First build takes a minute or two. Progress shows under the *Actions* tab; the
green link appears at the top of the *Pages* settings when it's live.

Every later `git push` to `main` redeploys automatically.

### Custom domain, if you buy one

Add a file called `CNAME` at the repo root containing just the domain:

```
florstorme.be
```

Then at your registrar create a `CNAME` record for `www` pointing at
`pablostorme.github.io`, and four `A` records for the bare domain pointing at
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
Back in *Settings* → *Pages*, enter the domain and tick *Enforce HTTPS* once
the certificate is issued.

## Editing the content

Everything readable lives in `index.html` — no templating to learn. The
sections are marked with comments (`<!-- ── work ── -->`). To add a project,
copy an existing `<article class="row">` block and change the text.

Colours and fonts are the CSS custom properties at the top of `styles.css`.
The coral accent is deliberately rationed — small labels and the email link
only; spreading it further is what makes it stop working.

Any element with `data-reveal` gets its words split and lit up as you scroll
(`data-reveal="load"` fades in on page load instead). Keep the text inside
those elements plain — `main.js` flattens any markup nested in them.
