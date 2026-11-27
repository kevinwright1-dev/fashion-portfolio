# Klozet

A full-stack website that works as a creative portfolio for personal style: a digital closet, outfit lookbooks, an inspo board and a community forum. Inspired by the 2010s alternative and hip-hop aesthetic of artists like Playboi Carti and Chief Keef.

![Site Screenshot](https://i.imgur.com/m8r6w7W.png)

[View the live site here](https://klozet.us/)

---

## Features

### Accounts & Profiles
* **Authentication:** Email/password sign up, log in and password reset through Supabase Auth (PKCE flow). Pages can send you back where you came from after login (`auth.html?redirect=...`). Cloudflare Turnstile CAPTCHA support is built in but currently switched off (`captchaEnabled` in `config.js`).
* **Profiles:** Avatar, bio and stats (closet item and outfit counts), plus a grid of the user's closet items and outfits.
* **Shareable profiles:** Any profile can be opened with `profile.html?id=<user id>`.
* **Edit profile:** Change your avatar and profile details.

### The Klozet (Digital Closet)
* **Add items:** A single-column form with a photo drop zone and preview, grouped into sections:
  * *Basics:* title, brand, category, size
  * *Look:* color(s), material
  * *Purchase:* price, where it was bought, purchase date
  * *Notes:* description
* **Browse:** Grid view with search, a filter panel (category, color) and sorting (newest, oldest, price high→low / low→high, brand A→Z).
* **Item details:** Click an item to open a modal with its full details, where you can **edit** or **delete** it.

### Outfits
* **Post outfits:** Upload a photo with a title, location and description.
* **Feed:** Browse everyone's outfits, sort by newest or top, and upvote.
* **Outfit details:** Modal view with the full description, the author and upvotes.

### Inspo Board
* A masonry-style board for saving inspiration images, with a detail modal for each image.

### Forum
* Start threads, reply to them (including replies to replies), and upvote threads and replies.

---

## Tech Stack

* **Frontend:** Plain HTML, CSS and JavaScript
* **Backend & Auth:** [Supabase](https://supabase.com/)
* **Database:** Supabase Postgres
* **Storage:** Supabase Storage buckets
* **Hosting:** Cloudflare 

---

## Project Structure

| File | Purpose |
| --- | --- |
| `index.html` | Landing page |
| `auth.html`, `auth.js`, `auth.css` | Sign up, log in and password reset |
| `closet.html` | Closet grid with search, filters, sort, and the item detail/edit modal |
| `add_item.html` | Add a clothing item |
| `outfits.html` | Outfit feed with upvotes |
| `add-outfit.html` | Post an outfit |
| `inspo.html` | Inspo board |
| `forum.html` | Forum threads and replies |
| `profile.html` | User profile (yours, or another user's via `?id=`) |
| `edit_profile.html` | Edit avatar and profile info |
| `404.html` | Not-found page served by Cloudflare |
| `config.js` | Supabase client setup and CAPTCHA toggle |
| `session.js` | Shared session handling (swaps the LOGIN/PROFILE nav links) |
| `style.css` | Global styles |
| `_headers` | Security headers (CSP, HSTS and others) for the auth page |
| `wrangler.jsonc` | Cloudflare deployment config |
| `test.html` | Supabase connection test page (not deployed) |
| `pics/` | Static images |

---

## Database

**Tables**
* `profiles`: user metadata (username, bio, avatar)
* `clothing_items`: individual wardrobe pieces and their details
* `outfits`: posted outfits
* `inspo_board`: saved inspo images
* `threads`: forum threads
* `thread_replies`: forum replies

**RPC functions** (used for upvotes)
* `add_upvote_outfit`
* `add_upvote_thread`
* `add_upvote_reply`

**Storage buckets**
* `avatars`, `clothing_img`, `outfit_img`, `inspo_img`

---

## Local Setup

1. **Clone the repo:**
    ```bash
    git clone https://github.com/kevinwright1-dev/fashion-portfolio.git
    cd fashion-portfolio
    ```
2. **Supabase config:** `config.js` already points at the project's Supabase instance. To use your own, swap in your project URL and anon key:
    ```javascript
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    ```
3. **Run:** There's no build step. Serve the folder with a static server, for example **VS Code Live Server** on `index.html`, or Cloudflare's local server:
    ```bash
    npx wrangler dev
    ```

## Deployment

The site is deployed to Cloudflare as static assets. `wrangler.jsonc` serves the repo root and uses `404.html` for missing pages. `.assetsignore` keeps files like `README.md`, `test.html` and `wrangler.jsonc` from being published.

---

## Planned Features

* **Comments** on outfits
* **Follow/Unfollow** and a personalized activity feed
* **Explore page** for trending outfits and new users
* **Analytics:** cost-per-wear and total wardrobe value

---
**Built by [Kevin Wright](https://github.com/kevinwright1-dev)**
