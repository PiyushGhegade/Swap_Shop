# 🛍️ CampusMarket (SwapShop)

**Team Members:**  
- Ansh Prem  
- Piyush Ghegade  

A full-stack marketplace built for IIT Patna students to buy, sell, and swap items within their campus community.  

## 🚀 Features

- **Browse and search listings**: Students can easily explore items by category or keyword.
- **Category-based filtering**: Click on categories to see specific items.
- **Create listings**: Logged-in users can post new items with images and details.
- **User profiles**: Each user has a profile page showing personal info, listings, and settings.
- **Messaging**: Students can message sellers directly within the platform.
- **Secure authentication**: JWT-based login system, restricted to @iitp.ac.in emails.
- **Responsive UI**: Works on desktop and mobile with a clean, modern design.
- **Admin-approved categories**: Supports dynamic category links in the footer and header.
- **Account deletion & settings management**.

---

## 💻 Tech Stack

### Frontend

- React (with JSX, no TypeScript)
- Tailwind CSS
- Wouter (for routing)
- React Query (`@tanstack/react-query`)
- Zod (form validation)
- Lucide React icons
- Remix Icon

### Backend

- Node.js & Express
- MongoDB & Mongoose
- JWT authentication
- Bcrypt for password hashing

---

## ⚙️ Project Structure

client/
├── components/
│ ├── layout/ # Header, footer, layout components
│ ├── products/ # Product grid, cards, detail views
│ ├── categories/ # Category sections and cards
│ ├── profile/ # Profile info, user listings
│ ├── messages/ # Chat and conversations
│ └── ui/ # Common UI elements (buttons, inputs, etc.)
├── hooks/ # Auth and toast hooks
├── pages/ # Home, Auth, Listing, Profile, etc.
├── App.tsx # Main router
└── main.tsx

Copy
Edit
server/
├── controllers/ # Express controllers (auth, listing, category, message, etc.)
├── middleware/ # Auth protection middleware
├── models/ # Mongoose models
├── routes/ # API route definitions
└── index.ts # Main server entry

yaml
Copy
Edit

---

## 🗺️ Features Overview

### 🔎 Search & Filter
- Full-text search on item titles.
- Dynamic URL query parameters for search and category.

### 💬 Messaging
- Real-time conversations between buyers and sellers.
- Unread messages indicator in header.

### 🧑‍💼 Profile
- Tabs for Profile, My Listings, Settings.
- Glow/active highlighting on active tab.

### 📝 Listings
- Create listings with multiple images (base64 uploaded).
- Automatic category selection and image preview.
- Price and description validation.

---

## 🔒 Authentication

- Only IIT Patna emails (`@iitp.ac.in`) are allowed.
- JWT stored securely and included in API calls.
- Support for session restore on refresh.

---

## 🚧 Setup Instructions

### Prerequisites

- Node.js & npm
- MongoDB instance (local or Atlas)

### Setup Backend

```bash
cd server
npm install
npm run dev
Setup Frontend
bash
Copy
Edit
cd client
npm install
npm run dev

git config user.name "Ansh Prem"
git config user.email "your.email@example.com"
