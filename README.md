# Kevin Fashion Portfolio

A full-stack website serving as a creative portfolio for my personal style. Inspired by the alte 2010s alternative and hip-hop aesthetic of artists like Playboi Carti and Chief Keef.

![Site Screenshot](https://via.placeholder.com/800x400?text=Screenshot+Of+Your+Site+Here)

## Live Demo

[View the live site here](https://kevinfashion-portfolio.netlify.app/)

## Features

*   **Multi-Page Layout:** Home, Closet, Fit Pics, Inspiration, and Guestbook.
*   **Retro UI/UX:** Designed to emulate the minimalist, gritty feel of early 2010s web design.
*   **Dynamic Guestbook:** A fully functional comment system allowing visitors to leave messages.
*   **Supabase Backend:** The guestbook is powered by a PostgreSQL database via Supabase, demonstrating full-stack capability.

## Tech Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Backend & Database:** Supabase (PostgreSQL)
*   **Deployment:** Netlify
*   **Font:** Roboto Mono (Google Fonts)

## Project Structure
fashion-portfolio/
├── index.html # Homepage
├── closet.html # Gallery of clothing items
├── fits.html # Gallery of outfit photos
├── inspo.html # Gallery of inspiration images
├── guestbook.html # Interactive comment section
├── style.css # Main stylesheet
├── config.js # Supabase configuration (IGNORED by Git)
└── README.md # This file

## How to Run Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/YourUserName/fashion-portfolio.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd fashion-portfolio
    ```
3.  Create a `config.js` file in the root directory and add your Supabase credentials:
    ```javascript
    // config.js
    const supabaseUrl = 'your-supabase-project-url';
    const supabaseKey = 'your-supabase-anon-key';
    ```
4.  Open `index.html` in your web browser.

## Notes

*   The `config.js` file is not included in the repository for security reasons. You must provide your own Supabase credentials to run the guestbook functionality locally.
