# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-01

### Added

- **Public Landing Page**: Hero section with branding, features overview (Write Freely, Role-Based Access, Local Storage), latest posts preview, and footer with navigation links. ([SCRUM-9589])
- **Login Page**: Username and password authentication with form validation, error messaging, and automatic redirect for already-authenticated users based on role. ([SCRUM-9589])
- **Registration Page**: New user sign-up with display name, username, password, and confirm password fields. Validates required fields, password match, and unique username. Redirects authenticated users to their appropriate home route. ([SCRUM-9589])
- **Role-Based Routing**: Protected route component (`ProtectedRoute`) supporting authentication checks and admin-only access control. Unauthenticated users are redirected to `/login`; non-admin users are redirected to `/blogs` when accessing admin routes. ([SCRUM-9589])
- **Blog CRUD Operations**:
  - **Create**: Write new blog posts with title and content fields, character counters, and validation. Posts are assigned a UUID and stored in localStorage. ([SCRUM-9589])
  - **Read**: View individual blog posts with full content, author avatar, author name, and creation date. Includes back navigation and post-not-found handling. ([SCRUM-9589])
  - **Update**: Edit existing blog posts with pre-filled form data. Ownership validation ensures only the post author or an admin can edit. ([SCRUM-9589])
  - **Delete**: Remove blog posts with confirmation dialog. Ownership validation ensures only the post author or an admin can delete. ([SCRUM-9589])
  - **List**: Responsive grid display of all blog posts sorted newest first, with blog cards showing title, content excerpt, author avatar, author name, and creation date. Empty state with call-to-action. ([SCRUM-9589])
- **Admin Dashboard**: Statistics overview (total posts, total users, admins, regular users) with stat cards, quick action links (Write New Post, Manage Users), and recent posts grid. ([SCRUM-9589])
- **User Management**: Admin-only page for creating and deleting platform users. Create user form with display name, username, password, and role selection. User list with avatar, role badge, creation date, and delete button. Hard-coded admin and currently logged-in user cannot be deleted. ([SCRUM-9589])
- **localStorage Persistence**: All data (posts, users, sessions) persisted via localStorage with robust error handling for read/write operations. Independent storage keys for posts (`writespace_posts`), users (`writespace_users`), and session (`writespace_session`). ([SCRUM-9589])
- **Hard-Coded Admin Account**: Built-in admin credentials (`admin` / `admin123`) that take priority over localStorage users with the same username. ([SCRUM-9589])
- **Authentication Utilities**: `login`, `logout`, `isAuthenticated`, `getCurrentUser`, and `isAdmin` functions in `auth.js` for session management. ([SCRUM-9589])
- **Reusable Components**:
  - `Navbar`: Authenticated navigation bar with brand, role-based links, user avatar, display name, logout button, and responsive mobile menu. ([SCRUM-9589])
  - `PublicNavbar`: Public navigation bar for guest pages with brand and auth-related links. ([SCRUM-9589])
  - `BlogCard`: Blog post card with title, content excerpt, author avatar, date, role-based accent border, and conditional edit link. ([SCRUM-9589])
  - `Avatar`: Role-distinct avatar component with emoji and color-coded styling (admin: 👑 violet, user: 📖 indigo). ([SCRUM-9589])
  - `StatCard`: Admin dashboard statistics card with label, value, icon, and color-coded styling. ([SCRUM-9589])
  - `UserRow`: User list row with avatar, display name, username, role badge, creation date, and conditional delete button. ([SCRUM-9589])
- **Tailwind CSS Styling**: Custom design system with extended color palette (primary, secondary, neutral, success, warning, danger), gradient backgrounds, custom shadows, animations (fade-in, slide-up, slide-down), and responsive typography. ([SCRUM-9589])
- **Vercel Deployment Configuration**: `vercel.json` with SPA rewrite rules for client-side routing support. ([SCRUM-9589])
- **Test Suite**: Unit and integration tests using Vitest and React Testing Library covering storage utilities, authentication logic, routing behavior, and page rendering. ([SCRUM-9589])

[1.0.0]: https://github.com/writespace/writespace/releases/tag/v1.0.0