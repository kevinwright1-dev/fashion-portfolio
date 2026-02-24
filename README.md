# Fashion Portfolio

A full-stack website serving as a creative portfolio for my personal style. Inspired by the alt 2010s alternative and hip-hop aesthetic of artists like Playboi Carti and Chief Keef.

![Site Screenshot](https://i.imgur.com/m8r6w7W.png)

---

[View the live site here](https://kevinfashion-portfolio.netlify.app/)

### **User System**
* **Authentication:** Full email/password flow via Supabase (Signup, Login, Password Reset).
* **Profiles:** Customizable user profiles with avatar uploads, bios, and real-time stats (item/outfit counts).

### **The Digital Closet**
* **Inventory Management:** Upload clothing with metadata (brand, size, price, category).
* **Filtering:** Dynamic gallery view with category-based filtering (Tops, Shoes, etc.).

### **Outfit Sharing ("Fits")**
* **Interactive Tagging:** A custom-built system where users click photos to tag specific closet items.
* **Visual Markers:** Interactive, numbered tag indicators on outfit photos.
* **Outfit Details:** Dedicated pages showing full outfit descriptions, occasion details, and clickable item previews.

*   **Frontend:** HTML5, CSS, JavaScript
*   **Backend & Database:** Supabase 
*   **Deployment:** Netlify
*   **Font:** Roboto Mono 

## Planned Features (In Progress)

* **Social Interaction:** Implementing Like/Unlike and a Comment system for outfits.
* **Community:** Follow/Unfollow functionality and personalized activity feeds.
* **Discovery:** Explore page for trending fits and new users.
* **Analytics:** Cost-per-wear calculator and wardrobe value tracking.

---

## Tech Stack

* **Frontend:** JavaScript, HTML5, CSS.
* **Backend:** Supabase.
* **Storage:** Supabase Storage (Buckets for avatars, items, and outfits).
* **Deployment:** Netlify.

---

## Local Setup

1.  **Clone & Navigate:**
    ```bash
    git clone [https://github.com/yourusername/fashion-closet.git](https://github.com/yourusername/fashion-closet.git)
    cd fashion-closet
    ```
2.  **Configure API:**
    Create a `config.js` file in the root:
    ```javascript
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseKey = 'YOUR_SUPABASE_KEY';
    ```
3.  **Run:**
    Open `index.html` using **VS Code Live Server**.

---

## Database Summary
The system runs on a relational PostgreSQL schema consisting of:
* `profiles`: User metadata.
* `clothing_items`: Individual wardrobe pieces.
* `outfits`: Shared lookbooks.
* `outfit_items`: Junction table for the interactive tagging system.

---
**Built by [Kevin Wright](https://github.com/kevinwright1-dev)**
