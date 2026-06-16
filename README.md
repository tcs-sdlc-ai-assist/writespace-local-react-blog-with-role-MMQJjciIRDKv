# WriteSpace

Your creative writing space. Share your thoughts, stories, and ideas with the world in a clean, distraction-free environment.

## Tech Stack

- **React 18** — UI library for building component-based interfaces
- **React Router DOM v6** — Client-side routing with role-based route protection
- **Vite 5** — Fast development server and optimized production builds
- **Tailwind CSS 3** — Utility-first CSS framework with custom design system
- **Vitest** — Unit and integration testing framework
- **React Testing Library** — Component testing utilities
- **uuid** — RFC4122 UUID generation for posts and users
- **localStorage** — Client-side data persistence (no backend required)

## Features

- **Public Landing Page** — Hero section, features overview, latest posts preview, and footer
- **Authentication** — Username/password login and registration with session management
- **Hard-Coded Admin Account** — Built-in admin credentials (`admin` / `admin123`)
- **Role-Based Access Control** — Admin and regular user roles with protected routes
- **Blog CRUD** — Create, read, update, and delete blog posts with ownership validation
- **Blog List** — Responsive grid of all posts sorted newest first with author avatars
- **Admin Dashboard** — Platform statistics, quick actions, and recent posts overview
- **User Management** — Admin-only page for creating and deleting platform users
- **Responsive Design** — Mobile-first layout with responsive navigation and grid system
- **localStorage Persistence** — All data stored client-side with robust error handling

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

Create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run the test suite:

```bash
npm test
```

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── vitest.setup.js             # Test setup (jest-dom, localStorage mock)
├── tailwind.config.js          # Tailwind CSS configuration with custom theme
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment configuration
├── public/
│   └── vite.svg                # Favicon
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Root component with route definitions
    ├── App.test.jsx            # Integration tests for routing
    ├── index.css               # Tailwind CSS directives
    ├── setupTests.js           # Test setup file
    ├── components/
    │   ├── Avatar.jsx          # Role-based avatar component (👑 admin, 📖 user)
    │   ├── BlogCard.jsx        # Blog post card for grid display
    │   ├── Navbar.jsx          # Authenticated navigation bar
    │   ├── ProtectedRoute.jsx  # Route guard for auth and admin access
    │   ├── PublicNavbar.jsx     # Public navigation bar for guest pages
    │   ├── StatCard.jsx        # Admin dashboard statistics card
    │   └── UserRow.jsx         # User list row for admin management
    ├── pages/
    │   ├── AdminDashboard.jsx  # Admin dashboard with stats and recent posts
    │   ├── Home.jsx            # Blog list page (all posts)
    │   ├── LandingPage.jsx     # Public landing page
    │   ├── LandingPage.test.jsx# Landing page tests
    │   ├── LoginPage.jsx       # Login form page
    │   ├── ReadBlog.jsx        # Single blog post reading page
    │   ├── RegisterPage.jsx    # Registration form page
    │   ├── UserManagement.jsx  # Admin user management page
    │   └── WriteBlog.jsx       # Blog post create/edit form page
    └── utils/
        ├── auth.js             # Authentication utilities (login, logout, session)
        ├── auth.test.js        # Auth utility tests
        ├── storage.js          # localStorage CRUD utilities
        └── storage.test.js     # Storage utility tests
```

## Route Map

| Path               | Component         | Access          | Description                        |
| ------------------- | ----------------- | --------------- | ---------------------------------- |
| `/`                 | LandingPage       | Public          | Landing page with hero and features |
| `/login`            | LoginPage         | Public          | User login form                    |
| `/register`         | RegisterPage      | Public          | User registration form             |
| `/blogs`            | Home              | Authenticated   | Blog post list (all posts)         |
| `/blogs/new`        | WriteBlog         | Authenticated   | Create a new blog post             |
| `/blogs/:id`        | ReadBlog          | Authenticated   | Read a single blog post            |
| `/blogs/:id/edit`   | WriteBlog         | Authenticated   | Edit an existing blog post         |
| `/admin`            | AdminDashboard    | Admin only      | Admin dashboard with statistics    |
| `/admin/users`      | UserManagement    | Admin only      | Create and manage platform users   |

## localStorage Schema

All data is persisted in the browser's localStorage under the following keys:

### `writespace_posts`

JSON array of post objects:

```json
[
  {
    "id": "uuid-string",
    "title": "Post Title",
    "content": "Post content text",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "authorId": "user-uuid-or-admin",
    "authorName": "Display Name"
  }
]
```

### `writespace_users`

JSON array of user objects:

```json
[
  {
    "id": "uuid-string",
    "displayName": "Display Name",
    "username": "username",
    "password": "plain-text-password",
    "role": "user|admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### `writespace_session`

JSON object representing the current session:

```json
{
  "userId": "user-uuid-or-admin",
  "username": "username",
  "displayName": "Display Name",
  "role": "user|admin"
}
```

### Hard-Coded Admin Account

The built-in admin account is not stored in localStorage. It is checked at login time with the following credentials:

- **Username:** `admin`
- **Password:** `admin123`

This account always takes priority over any localStorage user with the same username.

## Deployment

### Vercel

The project includes a `vercel.json` configuration file with SPA rewrite rules for client-side routing support.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com/).
3. Vercel will auto-detect the Vite framework and configure the build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy. All routes will be handled by the SPA rewrite rule in `vercel.json`.

### Manual Deployment

Build the project and serve the `dist/` directory with any static file server that supports SPA fallback (redirecting all routes to `index.html`):

```bash
npm run build
```

## License

This project is proprietary software. All rights reserved. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without prior written permission.