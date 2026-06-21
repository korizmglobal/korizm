# Korizm Global Education

Marketing website for **Korizm Global Education** — a consultancy helping students
study in **South Korea**: Korean university selection, admissions, student-visa (D-2/D-4)
assistance, scholarships (GKS), and pre/post-arrival support.

## Tech

Plain static site — no build step required.

```
index.html        # single-page site
css/styles.css     # brand theme (navy + crimson) and responsive layout
js/main.js         # nav, sticky header, animated counters, scroll reveal, forms
public/korizm.jpg  # logo
```

## Run locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or simply open `index.html` in a browser.

## Deploy

Hosted with **GitHub Pages** from the `main` branch (root). Any push to `main`
republishes the site automatically.
