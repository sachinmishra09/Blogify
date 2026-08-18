# Blogify

A full-stack blogging platform built with Node.js, Express, MongoDB, and EJS. Users can sign up, create and manage blog posts, comment on posts, and upload a custom profile picture — with images hosted persistently on Cloudinary.

**Live demo:** [blogify-8kr2.onrender.com](https://blogify-8kr2.onrender.com)

## Features

- **User authentication** — signup/signin with hashed passwords (HMAC + salt), JWT-based sessions stored in HTTP cookies
- **Blog CRUD** — create, read, update, and delete blog posts
- **Comments** — logged-in users can comment on blog posts
- **Author info** — blog posts display the author's name and profile picture via Mongoose population
- **Cloud-hosted image uploads** — blog cover images and profile pictures are uploaded via Multer directly to Cloudinary, so they persist across deploys and server restarts
- **Ownership checks** — only a blog's author can edit or delete it
- **Server-rendered views** — built with EJS templates and Bootstrap for styling

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Templating | EJS |
| Auth | JWT (jsonwebtoken), HMAC password hashing |
| File uploads | Multer + Cloudinary (multer-storage-cloudinary) |
| Styling | Bootstrap |
| Deployment | Render |
| Database hosting | MongoDB Atlas |

## Project Structure

```
Blogify/
├── app.js                   # Entry point — Express app setup, DB connection
├── controllers/              # (reserved for future route-logic extraction)
├── models/                   # Mongoose schemas — blog.js, comment.js, user.js
├── routes/                   # Route handlers — blog.js, user.js
├── middlewares/               # authentication.js — JWT cookie verification
├── services/                  # authentication.js — JWT sign/verify helpers
├── utils/                      # cloudinary.js — Cloudinary + Multer storage config
├── views/                    # EJS templates
│   ├── partials/               # head.ejs, nav.ejs, script.ejs
│   ├── addBlog.ejs
│   ├── blog.ejs
│   ├── editBlog.ejs
│   ├── home.ejs
│   ├── profileChange.ejs
│   ├── signin.ejs
│   └── signup.ejs
├── public/
│   └── images/
│       └── default.png       # Default profile picture fallback
└── .env                       # Environment variables (not committed)
```

> Note: blog cover images and profile pictures are uploaded directly to Cloudinary via Multer — no local `uploads/` folder is used or required at runtime.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB database (local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- A free [Cloudinary](https://cloudinary.com) account (for image uploads)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/sachinmishra09/Blogify.git
   cd Blogify
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   MONGO_URL=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   PORT=8000
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. Start the server
   ```bash
   npm start
   ```

5. Visit `http://localhost:8000` in your browser

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret key used to sign and verify JWTs |
| `PORT` | Port the server runs on (defaults to 8000) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Deployment

This project is deployed on [Render](https://render.com) with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) as the database and [Cloudinary](https://cloudinary.com) for image storage. All environment variables above must be configured in Render's Environment tab, and the MongoDB Atlas cluster's Network Access must allow connections from anywhere (`0.0.0.0/0`) since Render's IPs are dynamic.

## Future Improvements

- Pagination and search for blog listings
- Like/upvote system for posts
- Role-based admin dashboard
- Input validation and CSRF protection
- Nested/threaded comments

## License

This project is open source and available for learning purposes.
