# Fashion Closet Platform 👔

**A minimalist, full-stack social wardrobe manager.** Inspired by 2010s alternative fashion culture and dark aesthetics.

[**Live Demo**](https://kevinfashion-portfolio.netlify.app/)

---

## ✅ Completed Features

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

---

## 🛠 Tech Stack

* **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Dark Theme).
* **Backend:** Supabase (Auth & PostgreSQL).
* **Storage:** Supabase Storage (Buckets for avatars, items, and outfits).
* **Deployment:** Netlify.

---

## 🚀 Local Setup

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

## 🗄 Database Summary
The system runs on a relational PostgreSQL schema consisting of:
* `profiles`: User metadata.
* `clothing_items`: Individual wardrobe pieces.
* `outfits`: Shared lookbooks.
* `outfit_items`: Junction table for
