# Fashion Closet Platform 👔

**A full-stack social fashion platform for building your digital wardrobe and sharing your fits**

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Tech Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Supabase-blue)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Pages & Functionality](#pages--functionality)
- [Development Timeline](#development-timeline)
- [Future Enhancements](#future-enhancements)
- [Credits](#credits)

---

## 🎯 Overview

**Fashion Closet** is a social platform inspired by Instagram but focused on fashion. Users can:
- Build a digital closet by uploading their clothing items
- Share outfit photos ("fits") 
- Tag clothing items in outfit photos
- Follow other users and engage with their content
- Track wardrobe statistics and analytics

**Design Philosophy:** Minimalist, dark aesthetic inspired by 2010s alternative/hip-hop culture (Playboi Carti, Chief Keef era).

**Live Demo:** [kevinfashion-portfolio.netlify.app](https://kevinfashion-portfolio.netlify.app/)

---

## ✨ Features

### ✅ Implemented (Weeks 1-6)

#### **Authentication & User Management**
- Email/password authentication via Supabase
- User signup with username validation
- Login/logout functionality
- Password reset via email
- Custom email templates (all auth flows)

#### **User Profiles**
- Customizable profile with avatar, bio, location, website
- Avatar upload to Supabase Storage
- View items count, outfits count, followers count
- Edit profile information

#### **Digital Closet**
- Upload clothing items with photos
- Categorize items (tops, bottoms, shoes, accessories, outerwear, other)
- Add metadata: brand, color, size, price, purchase date, purchase link
- Filter closet by category
- View all items in gallery layout

#### **Outfit Sharing**
- Upload outfit photos ("fits")
- Add outfit details: title, description, occasion, location, date worn
- Interactive tagging system - click on photo to tag clothing items
- Visual tag markers with numbered indicators
- View outfit feed with all posts

#### **Outfit Details**
- Full outfit view with clickable tag markers
- Popup previews showing tagged item details
- Sidebar list of all tagged items
- Click item to highlight its tag on photo
- Edit tags or delete outfit (owner only)
- Engagement metrics (likes, comments counts)

### 🚧 Coming Soon (Weeks 7-12)

- **Social Features:** Like/unlike outfits, comment system, follow/unfollow users
- **Feed Algorithm:** Personalized feed based on follows
- **Explore Page:** Trending outfits, new users, style categories
- **Advanced Tagging:** Drag-to-reposition tags, tag validation
- **Shopping Features:** Price tracking, "Shop This Outfit" view, marketplace for selling items
- **Analytics:** Wardrobe statistics, cost-per-wear calculator, most worn items
- **AI Features:** Color matching suggestions, outfit recommendations, weather-based suggestions
- **Community:** Outfit challenges, voting/polls, style quizzes, badges/achievements

---

## 🛠️ Tech Stack

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with dark theme
- **JavaScript (Vanilla)** - No frameworks, pure JS
- **Font:** Roboto Mono (monospace for that retro vibe)

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Storage (images)
  - Row Level Security (RLS)

### **Deployment**
- **Netlify** - Static site hosting
- **Supabase Cloud** - Database and storage hosting

### **External Services**
- **Supabase Storage** - Image hosting (avatars, clothing items, outfits)
- **Email Service** - Transactional emails via Supabase Auth

---

## 🗄️ Database Schema

### **Tables**

#### `profiles`
```sql
- id (UUID, PK, references auth.users)
- username (TEXT, UNIQUE)
- full_name (TEXT)
- bio (TEXT)
- avatar_url (TEXT)
- location (TEXT)
- website (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `clothing_items`
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- title (TEXT)
- description (TEXT)
- brand (TEXT)
- category (TEXT) - CHECK: tops, bottoms, shoes, accessories, outerwear, other
- color (TEXT)
- size (TEXT)
- price (DECIMAL)
- purchase_link (TEXT)
- purchase_date (DATE)
- image_url (TEXT)
- times_worn (INTEGER)
- is_for_sale (BOOLEAN)
- sale_price (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `outfits`
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- title (TEXT)
- description (TEXT)
- image_url (TEXT)
- date_worn (DATE)
- occasion (TEXT)
- location (TEXT)
- likes_count (INTEGER)
- comments_count (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `outfit_items` (Junction Table)
```sql
- id (UUID, PK)
- outfit_id (UUID, FK → outfits)
- clothing_item_id (UUID, FK → clothing_items)
- tag_position_x (DECIMAL) - X coordinate percentage
- tag_position_y (DECIMAL) - Y coordinate percentage
- created_at (TIMESTAMP)
```

#### `likes`
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- likeable_type (TEXT) - 'outfit' or 'clothing_item'
- likeable_id (UUID)
- created_at (TIMESTAMP)
```

#### `comments`
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- author (TEXT) - For anonymous guestbook comments
- commentable_type (TEXT) - 'outfit', 'clothing_item', 'guestbook'
- commentable_id (UUID)
- comment_text (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `follows`
```sql
- id (UUID, PK)
- follower_id (UUID, FK → profiles)
- following_id (UUID, FK → profiles)
- created_at (TIMESTAMP)
```

### **Storage Buckets**
- `avatars` - User profile pictures (5MB max)
- `clothing-items` - Clothing item photos (10MB max)
- `outfits` - Outfit photos (10MB max)

---

## 📁 Project Structure

```
fashion-closet/
│
├── index.html                 # Homepage
├── auth.html                  # Sign up / Login page
├── profile.html               # User profile page
├── edit-profile.html          # Edit profile & upload avatar
│
├── closet.html                # View closet items (gallery)
├── add-item.html              # Upload clothing item form
│
├── fits.html                  # Outfit feed (all outfits)
├── add-outfit.html            # Upload outfit form
├── tag-outfit.html            # Tag items on outfit photo
├── outfit-detail.html         # View individual outfit
│
├── inspo.html                 # Inspiration gallery
├── guestbook.html             # Comments/guestbook
│
├── style.css                  # Main stylesheet
├── config.js                  # Supabase configuration
├── .gitignore                 # Ignore config.js
│
├── pics/                      # Image assets
│   ├── IMG_*.JPEG             # Outfit photos
│   ├── carti.jpg              # Inspiration images
│   └── ...
│
└── README.md                  # Project documentation
```

---

## 🚀 Setup Instructions

### **Prerequisites**
- Modern web browser
- Text editor (VS Code recommended)
- Local web server (Live Server extension for VS Code)
- Supabase account (free tier)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/yourusername/fashion-closet.git
cd fashion-closet
```

### **Step 2: Set Up Supabase**

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy your project URL and anon key

2. **Run Database Migration**
   - Go to SQL Editor in Supabase
   - Copy and run the migration script (see database schema above)
   - All tables, indexes, RLS policies, and triggers will be created

3. **Create Storage Buckets**
   - Go to Storage in Supabase
   - Create 3 public buckets: `avatars`, `clothing-items`, `outfits`
   - Set up storage policies (see setup guide)

4. **Configure Authentication**
   - Go to Authentication → Providers
   - Enable Email provider
   - Configure email templates (optional)
   - Set Site URL to your domain

### **Step 3: Configure Project**

1. Create `config.js` in project root:
```javascript
// config.js
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

2. Add `config.js` to `.gitignore`:
```
config.js
```

### **Step 4: Run Locally**

**Option A: VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"
3. Site opens at `http://127.0.0.1:5500`

**Option B: Python**
```bash
python -m http.server 8080
# Open http://localhost:8080
```

**Option C: Node.js**
```bash
npx http-server
```

### **Step 5: Deploy to Netlify**

1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Add environment variables (if using environment variables instead of config.js)
4. Deploy!

**Or use Netlify Drop:**
- Drag project folder to [netlify.com/drop](https://app.netlify.com/drop)

---

## 📄 Pages & Functionality

### **Public Pages**

#### `index.html` - Homepage
- Site intro with hero image
- Links to main sections
- Login/Profile link (conditional)

#### `inspo.html` - Inspiration Gallery
- Gallery of fashion inspiration images
- Artists: Playboi Carti, Ken Carson, A$AP Rocky, etc.

#### `guestbook.html` - Comments
- Public comment section
- Anyone can leave comments (no auth required)
- Loads comments from Supabase

### **Authentication Pages**

#### `auth.html` - Sign Up / Login
- Tabbed interface (Sign Up / Login)
- Email/password authentication
- Username validation (unique, 3-30 chars)
- Password confirmation
- Forgot password link
- Custom styled to match theme

### **User Pages (Auth Required)**

#### `profile.html` - User Profile
- User avatar, username, bio
- Stats: items count, outfits count, followers count
- User's closet items gallery
- User's outfits gallery
- Edit Profile button (owner only)
- Logout button

#### `edit-profile.html` - Edit Profile
- Upload/change avatar (with preview)
- Edit username, full name, bio, location, website
- Character counter for bio (200 max)
- Username availability check
- Save changes to database

### **Closet Pages**

#### `closet.html` - Closet Gallery
- View all clothing items
- Filter by category (All, Tops, Bottoms, Shoes, etc.)
- Shows user's items if logged in, public items otherwise
- Add Item button (logged in users)
- Empty state if no items

#### `add-item.html` - Add Clothing Item
- Two-column layout (image + form)
- Upload item photo with preview
- Form fields:
  - Title (required)
  - Brand, Category (required), Color, Size
  - Price, Purchase Date, Purchase Link
  - Description
- Category dropdown styled to match theme
- Validation (image size, required fields)
- Saves to database + uploads image to storage

### **Outfit Pages**

#### `fits.html` - Outfit Feed
- Gallery of all outfit posts
- Shows username, likes, comments, tags count
- Click outfit to view details
- Share Fit button (logged in users)
- Empty state if no outfits

#### `add-outfit.html` - Share Outfit
- Two-column layout (image + form)
- Upload outfit photo with preview
- Form fields:
  - Title (required)
  - Description, Date Worn, Occasion, Location
- After posting, redirects to tagging page
- Saves to database + uploads image to storage

#### `tag-outfit.html` - Tag Items
- Interactive tagging interface
- Click outfit photo to place tag marker
- Select item from closet list to assign to tag
- Visual numbered markers on photo
- Tagged items list with remove option
- Save tags to database or skip

#### `outfit-detail.html` - View Outfit
- Full outfit view with all details
- User info (avatar, username, date)
- Outfit info (title, description, occasion, location)
- Engagement stats (likes, comments, items count)
- Interactive tag markers
  - Click marker to see item popup
  - Popup shows item image, name, brand, category
- Tagged items sidebar
  - Click item to highlight its tag
- Owner actions (Edit Tags, Delete Outfit)
- Like & Comment buttons (placeholders)

---

## 📅 Development Timeline

### **✅ Completed**

#### **Week 1-2: Foundation**
- ✅ Supabase database setup
- ✅ Authentication system (signup, login, logout)
- ✅ User profile creation
- ✅ Email templates (all 6 auth flows)
- ✅ Storage buckets configuration

#### **Week 3-4: User Profiles & Upload**
- ✅ Edit profile page
- ✅ Avatar upload functionality
- ✅ Add clothing item form
- ✅ Image upload to storage
- ✅ Closet gallery with filters

#### **Week 5-6: Outfit Creation**
- ✅ Add outfit page
- ✅ Interactive tagging system
- ✅ Tag outfit interface
- ✅ Outfit feed
- ✅ Outfit detail view with clickable tags

### **🚧 In Progress**

#### **Week 7-8: Social Features**
- [ ] Like/unlike system
- [ ] Comment system for outfits
- [ ] Follow/unfollow users
- [ ] Activity feed
- [ ] Notifications

### **📋 Planned**

#### **Week 9-12: Discovery & Engagement**
- [ ] Personalized feed algorithm
- [ ] Explore page (trending, new users)
- [ ] Hashtag system
- [ ] Outfit challenges
- [ ] User badges

#### **Week 13-16: Shopping & Analytics**
- [ ] Price tracking for items
- [ ] "Shop This Outfit" feature
- [ ] Marketplace (buy/sell items)
- [ ] Wardrobe analytics dashboard
- [ ] Cost-per-wear calculator

#### **Week 17+: Advanced Features**
- [ ] AI color matching
- [ ] Outfit recommendations
- [ ] Weather-based suggestions
- [ ] Collections/moodboards
- [ ] Mobile app (PWA)

---

## 🎨 Design Features

### **Visual Aesthetic**
- **Color Scheme:** Pure black (#0a0a0a) background, white (#ffffff) text
- **Accents:** Dark gray borders (#222, #333), muted grays for secondary text (#666, #999)
- **Font:** Roboto Mono (monospace for retro tech vibe)
- **Background:** Subtle "OPIUM" watermark text

### **UI/UX Patterns**
- Minimalist navigation bar
- Grid-based gallery layouts (auto-fill, responsive)
- Dark theme form inputs with white borders
- Hover effects on interactive elements
- Empty states with clear CTAs
- Toast messages for success/error feedback
- Consistent button styling across site

### **Responsive Design**
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interactive elements
- Image optimization for different screen sizes

---

## 🔐 Security Features

### **Row Level Security (RLS)**
All database tables have RLS policies:
- **Profiles:** Anyone can view, only owner can update
- **Clothing Items:** Anyone can view, only owner can modify/delete
- **Outfits:** Anyone can view, only owner can modify/delete
- **Likes:** Anyone can view, authenticated users can like, only owner can delete
- **Comments:** Anyone can view, authenticated users can comment, only owner can delete
- **Follows:** Anyone can view, authenticated users can follow, only owner can unfollow

### **Storage Security**
- Public read access for all buckets (images need to be viewable)
- Only authenticated users can upload
- Users can only update/delete their own files
- File size limits enforced (5MB avatars, 10MB items/outfits)
- File type validation (images only)

### **Authentication**
- Email confirmation (optional, can be disabled for development)
- Password requirements (minimum 6 characters)
- Password reset via email
- Session management via Supabase Auth

---

## 🚀 Future Enhancements

### **High Priority**
1. **Mobile App** - Convert to Progressive Web App (PWA)
2. **Search** - Search users, items, outfits by keyword
3. **Notifications** - Real-time notifications for likes, comments, follows
4. **Direct Messaging** - User-to-user messaging
5. **Collections** - Save favorite outfits to collections

### **Medium Priority**
6. **Advanced Filters** - Filter by color, brand, price range, date
7. **Style Profiles** - AI-generated style analysis
8. **Outfit Calendar** - Plan outfits for upcoming events
9. **Wardrobe Insights** - Most/least worn items, spending patterns
10. **Social Sharing** - Share to Instagram, Twitter, etc.

### **Low Priority**
11. **Barcode Scanner** - Scan clothing tags to auto-populate item info
12. **Virtual Try-On** - AR feature for visualizing outfits
13. **Style Consultations** - Book sessions with style experts
14. **Sustainability Score** - Track environmental impact
15. **Brand Partnerships** - Official brand profiles and collaborations

---

## 🐛 Known Issues

- [ ] Date picker styling inconsistent across browsers
- [ ] Tag markers can overlap if placed too close together
- [ ] No pagination on feeds (performance issue with many items)
- [ ] No image cropping/editing before upload
- [ ] No way to reorder items in closet
- [ ] Comments feature not yet implemented
- [ ] Like feature not yet implemented

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

**To suggest features:**
1. Open an issue on GitHub
2. Describe the feature and use case
3. Include mockups/examples if applicable

**To report bugs:**
1. Open an issue on GitHub
2. Include steps to reproduce
3. Include browser/device info
4. Include screenshots if applicable

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Credits

### **Created By**
Kevin Wright - [GitHub](https://github.com/yourusername)

### **Inspiration**
- Playboi Carti, Chief Keef, A$AP Rocky, Ken Carson (aesthetic inspiration)
- Instagram (social features)
- Pinterest (visual discovery)
- SSENSE, Grailed (fashion e-commerce)

### **Technologies**
- [Supabase](https://supabase.com) - Backend and database
- [Netlify](https://netlify.com) - Hosting
- [Google Fonts](https://fonts.google.com) - Roboto Mono font

### **Tools Used**
- VS Code - Code editor
- Claude AI - Development assistant
- Chrome DevTools - Debugging
- Figma - Design mockups (planning)

---

## 📞 Contact

- **Email:** your.email@example.com
- **Portfolio:** [kevinfashion-portfolio.netlify.app](https://kevinfashion-portfolio.netlify.app)
- **GitHub:** [@yourusername](https://github.com/yourusername)
- **Twitter:** [@yourusername](https://twitter.com/yourusername)

---

**Built with 💜 and a love for fashion**