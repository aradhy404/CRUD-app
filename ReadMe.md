# User Auth API

A small backend built from scratch with Express and PostgreSQL, with full JWT-based authentication and a minimal vanilla JS demo frontend.

## What this is

A REST API for managing users, with:
- Full CRUD on a `users` table (Create, Read, Update, Delete)
- Password hashing with `bcrypt` — passwords are never stored in plain text
- JWT-based login — issues a signed token on successful login
- Route-level auth middleware — some routes (update/delete) require a valid token
- Parameterized SQL queries throughout — no string-concatenated SQL, to prevent SQL injection
- A plain HTML/JS frontend (no framework) that demonstrates calling the API, storing the JWT, and attaching it to protected requests

This was built to learn backend fundamentals properly — every route was written, run, and debugged from scratch, not copied from a tutorial.

## Tech stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL (raw `pg` queries, no ORM)
- **Auth:** `bcrypt` for password hashing, `jsonwebtoken` for session tokens
- **Frontend:** Vanilla HTML/CSS/JS, served as static files via Express

## Project structure

```
.
├── index.js              # App entry point, route mounting, middleware setup
├── database/
│   └── db.js              # PostgreSQL connection pool
├── middleware/
│   └── auth.js            # JWT verification middleware for protected routes
├── routes/
│   └── auth.js             # /auth/register and /auth/login
├── public/                 # Static frontend files, served at the root
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── users.html
│   ├── style.css
│   └── common.js
└── .env                     # Environment variables (not committed)
```

## Setup

1. **Clone the repo and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL** — create a database and a `users` table:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     password TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Create a `.env` file** in the project root:
   ```
   DATABASE_URL=postgres://user:password@localhost:5432/your_db_name
   JWT_SECRET=a-long-random-secret-string
   ```
   If your database password contains special characters (like `@`), URL-encode them (`@` becomes `%40`).

4. **Run the server:**
   ```bash
   node index.js
   # or, with auto-restart on changes:
   npx nodemon index.js
   ```

5. **Open the app** at `http://localhost:3000` in your browser.

## API routes

| Method | Route               | Auth required | Description                     |
|--------|----------------------|----------------|----------------------------------|
| POST   | `/auth/register`     | No             | Create a new user (hashes password) |
| POST   | `/auth/login`        | No             | Verify credentials, returns a JWT |
| GET    | `/users`             | No             | List all users                   |
| POST   | `/users`             | No             | Create a user (no auth, separate from register) |
| PUT    | `/users/:id`         | Yes (Bearer token) | Update a user's name/email   |
| DELETE | `/users/:id`         | Yes (Bearer token) | Delete a user                |

For protected routes, send the token from `/auth/login` in the request header:
```
Authorization: Bearer <token>
```

## Why these design choices

- **Parameterized queries (`$1`, `$2`, ...)** instead of string concatenation — prevents SQL injection, since user input is always treated as data, never as part of the SQL command itself.
- **`bcrypt` for password hashing** — one-way hashing with a built-in salt, so even identical passwords produce different hashes, and the original password can never be recovered from the database.
- **JWT for sessions** — stateless authentication; the server doesn't need to store session data, it just verifies the token's signature on each protected request.
- **`404` vs `400` vs `401`** — status codes are used deliberately: `400` for malformed requests (missing fields), `401` for authentication failures (missing/invalid token or wrong credentials), `404` when a valid-looking id doesn't match any row.

## Known limitations (next steps)

This is a learning project, not a production system. Things deliberately left out for now:
- No refresh tokens — the JWT simply expires after a fixed time
- No rate limiting on login attempts
- No email verification
- Minimal frontend — built as a demo client to exercise the API, not a polished UI