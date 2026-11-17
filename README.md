# fvp-portfolios-starter

Starter code for **FVP Portfolios**. Session 1 uses it for "Web fundamentals"; in session 2 you deploy this same repo to Cloudflare Pages.

Each exercise is plain HTML, CSS and JavaScript, with no build step and no libraries.

| Folder | Slide | What you do |
|---|---|---|
| `02-be-the-server/` | Try it 2 | Play a web server: map paths to files, return 404s, 301 redirects and content-types |
| `03-scale-it/` | Try it 3 | Add containers behind a load balancer until nobody waits; then see what idle costs |
| `04-form-handler/` | Try it 4 | A contact-form handler written exactly like a Cloudflare Worker |
| `05-platform-picker/` | Try it 5 | Weight six criteria and rank Wix, WordPress, Jekyll, Hugo and GitHub Pages |

(Try it 1 uses the browser's own DevTools, so it has no code.)

## Run locally

Open any `index.html` in a browser. Each one loads its own `style.css` and `app.js`.

## Make the CodePen pens (teacher, once a year)

For each folder:

1. On codepen.io choose **Create → Pen**.
2. **HTML panel:** paste the part of `index.html` between `<!-- CODEPEN START -->` and `<!-- CODEPEN END -->`.
3. **CSS panel:** paste all of `style.css`.
4. **JS panel:** paste all of `app.js`.
5. Name the pen after the folder (e.g. `02 be-the-server`), save it, and put the link on the course page.

Students open the link and click **Fork** to get their own copy.

## Session 2

The root `index.html` links to every exercise, so the repo is already a small website. Next session you fork this repo and connect it to **Cloudflare Pages**, and the form handler from `04` becomes a real Worker.
