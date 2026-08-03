# Abid Ali — 3D Portfolio Template

A colorful, playful 3D portfolio site built with HTML, CSS and Three.js.
No build tools or frameworks needed — just open `index.html` in a browser.

## 📁 Folder structure

```
portfolio/
├── index.html              ← all page content lives here
├── css/
│   └── style.css           ← colors, fonts, layout (design tokens at the top)
├── js/
│   ├── three-scene.js      ← the floating 3D shapes in the hero section
│   ├── tilt.js              ← 3D tilt-on-hover effect for cards
│   └── main.js              ← cursor, nav, scroll animations, counters, form
├── assets/
│   ├── images/              ← put your project screenshots / photo here
│   └── resume/
│       └── resume.pdf       ← add your real resume here (this exact filename)
└── README.md
```

## ✏️ What to personalize

Everything is placeholder content — search `index.html` for these and replace them:

1. **Name** — currently "Abid Ali", appears in the hero, footer and nav logo (`Aabi`).
2. **Photo** — `assets/images/profile.png` is shown in the hero, floating in front of the 3D
scene with a mouse-tilt effect. Swap it for your own photo (keep the same filename, or
update the `src` on the `.hero-photo` `<img>` in `index.html`).
3. **About section** — bio text, location, university, currently-learning line.
4. **Skills** — edit the 6 cards in `#skillsGrid` to match your real stack.
5. **Projects** — 4 placeholder cards in `#projects`. Replace title, description, tags
and links (`Live demo` / `Source`) with your real projects and GitHub repo links.
6. **Education** — timeline items: university name, CGPA, coursework, certifications.
7. **Contact** — update the email, GitHub and LinkedIn links near the bottom of `index.html`.
8. **Résumé button** — drop your PDF into `assets/resume/` and name it `resume.pdf`.

## 🎨 Changing colors / fonts

Open `css/style.css` and edit the `:root` variables at the top of the file:

```css
--bg:     #1A1738;   /\* page background \*/
--coral:  #FF6B9D;
--cyan:   #4ECDC4;
--yellow: #FFD93D;
--violet: #8E7CFF;
```

Fonts (Space Grotesk for headings, Plus Jakarta Sans for body, JetBrains Mono for
labels) are loaded from Google Fonts in the `<head>` of `index.html` — swap the
`<link>` tag and the `--font-\*` variables together if you want different ones.

## 📬 Making the contact form actually work

The form currently only shows a confirmation message — it doesn't send email yet.
Easiest options:

* [Formspree](https://formspree.io) — add `action="https://formspree.io/f/yourFormId"` to the `<form>` tag.
* [EmailJS](https://www.emailjs.com) — send straight from JavaScript, no backend needed.

## 🚀 Hosting it for free

Any static host works — drag-and-drop the whole `portfolio` folder into:

* **Netlify** (drag \& drop deploy)
* **Vercel**
* **GitHub Pages** (push to a repo, enable Pages in settings)

## 🛠 Notes

* Built with vanilla JS + [Three.js](https://threejs.org) r128, vendored locally in `js/vendor/three.min.js` — no CDN or npm install required, works offline.
* Fully responsive down to mobile, with a reduced-motion mode for accessibility.
* The hero's floating shapes react to your mouse and scroll position.

