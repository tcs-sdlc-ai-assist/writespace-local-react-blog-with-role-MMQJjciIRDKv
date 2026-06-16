import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { setSession, clearSession, addUser, addPost } from './utils/storage.js';

/**
 * Helper to render the App with a specific route using MemoryRouter.
 * We need to replace BrowserRouter in App with MemoryRouter for testing,
 * so we mock the components and test routing logic via ProtectedRoute behavior.
 */

// We cannot easily swap BrowserRouter for MemoryRouter inside App,
// so we test by rendering App and relying on the BrowserRouter,
// or we test the routing logic by rendering routes directly.
// The approach here: render the full App but manipulate window.location
// via MemoryRouter wrapping individual route components.

// Actually, since App.jsx uses BrowserRouter internally, we need to
// test by mocking react-router-dom partially or by testing the
// individual route guards. The cleanest approach for integration
// testing is to extract routes and wrap with MemoryRouter.

// Let's take the approach of mocking BrowserRouter to use MemoryRouter.

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => children,
  };
});

/**
 * Renders the App inside a MemoryRouter at the given initial route.
 * @param {string} initialRoute - The initial URL path.
 * @returns {import('@testing-library/react').RenderResult}
 */
function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
}

describe('App Routing', () => {
  beforeEach(() => {
    localStorage.clear();
    clearSession();
  });

  // ─── Public Routes ──────────────────────────────────────────────────────

  describe('public routes', () => {
    it('renders the landing page at /', () => {
      renderApp('/');
      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
      expect(screen.getByText(/Your creative writing space/i)).toBeInTheDocument();
    });

    it('renders the login page at /login', () => {
      renderApp('/login');
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your WriteSpace account')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders the register page at /register', () => {
      renderApp('/register');
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Join WriteSpace and start writing today')).toBeInTheDocument();
      expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });
  });

  // ─── Protected Routes (unauthenticated) ─────────────────────────────────

  describe('protected routes redirect unauthenticated users to login', () => {
    it('redirects /blogs to /login when not authenticated', () => {
      renderApp('/blogs');
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your WriteSpace account')).toBeInTheDocument();
    });

    it('redirects /blogs/new to /login when not authenticated', () => {
      renderApp('/blogs/new');
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /blogs/:id to /login when not authenticated', () => {
      renderApp('/blogs/some-id');
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /blogs/:id/edit to /login when not authenticated', () => {
      renderApp('/blogs/some-id/edit');
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  // ─── Admin Routes (unauthenticated) ─────────────────────────────────────

  describe('admin routes redirect unauthenticated users to login', () => {
    it('redirects /admin to /login when not authenticated', () => {
      renderApp('/admin');
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('redirects /admin/users to /login when not authenticated', () => {
      renderApp('/admin/users');
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  // ─── Admin Routes (non-admin user) ─────────────────────────────────────

  describe('admin routes redirect non-admin users to /blogs', () => {
    beforeEach(() => {
      const user = {
        id: 'user-1',
        displayName: 'Regular User',
        username: 'regularuser',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);
      setSession({
        userId: 'user-1',
        username: 'regularuser',
        displayName: 'Regular User',
        role: 'user',
      });
    });

    it('redirects /admin to /blogs for non-admin users', () => {
      renderApp('/admin');
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('redirects /admin/users to /blogs for non-admin users', () => {
      renderApp('/admin/users');
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });
  });

  // ─── Protected Routes (authenticated regular user) ──────────────────────

  describe('protected routes render for authenticated regular user', () => {
    beforeEach(() => {
      const user = {
        id: 'user-1',
        displayName: 'Test User',
        username: 'testuser',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);
      setSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });
    });

    it('renders the blog list at /blogs', () => {
      renderApp('/blogs');
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('renders the write blog page at /blogs/new', () => {
      renderApp('/blogs/new');
      expect(screen.getByText('Write a New Post')).toBeInTheDocument();
    });

    it('renders the read blog page at /blogs/:id with a valid post', () => {
      const post = {
        id: 'post-1',
        title: 'Test Blog Post',
        content: 'This is the content of the test blog post.',
        createdAt: '2024-06-15T10:00:00.000Z',
        authorId: 'user-1',
        authorName: 'Test User',
      };
      addPost(post);

      renderApp('/blogs/post-1');
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      expect(screen.getByText('This is the content of the test blog post.')).toBeInTheDocument();
    });

    it('shows post not found for invalid blog id', () => {
      renderApp('/blogs/non-existent-id');
      expect(screen.getByText('Post not found')).toBeInTheDocument();
    });

    it('displays the navbar with user info for authenticated user', () => {
      renderApp('/blogs');
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Blogs')).toBeInTheDocument();
      expect(screen.getByText('Write')).toBeInTheDocument();
    });

    it('does not show admin navigation links for regular user', () => {
      renderApp('/blogs');
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Users')).not.toBeInTheDocument();
    });
  });

  // ─── Admin Routes (authenticated admin) ─────────────────────────────────

  describe('admin routes render for authenticated admin', () => {
    beforeEach(() => {
      setSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('renders the admin dashboard at /admin', () => {
      renderApp('/admin');
      expect(screen.getByText(/Welcome back, Admin!/)).toBeInTheDocument();
    });

    it('renders the user management page at /admin/users', () => {
      renderApp('/admin/users');
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Create New User')).toBeInTheDocument();
    });

    it('displays admin navigation links in navbar', () => {
      renderApp('/admin');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Blogs')).toBeInTheDocument();
      expect(screen.getByText('Write')).toBeInTheDocument();
    });

    it('displays admin display name in navbar', () => {
      renderApp('/admin');
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('can also access regular protected routes', () => {
      renderApp('/blogs');
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('can access write blog page', () => {
      renderApp('/blogs/new');
      expect(screen.getByText('Write a New Post')).toBeInTheDocument();
    });
  });

  // ─── Login page redirects authenticated users ───────────────────────────

  describe('login page redirects authenticated users', () => {
    it('redirects authenticated regular user from /login to /blogs', () => {
      setSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderApp('/login');
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('redirects authenticated admin from /login to /admin', () => {
      setSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderApp('/login');
      expect(screen.getByText(/Welcome back, Admin!/)).toBeInTheDocument();
    });
  });

  // ─── Register page redirects authenticated users ────────────────────────

  describe('register page redirects authenticated users', () => {
    it('redirects authenticated regular user from /register to /blogs', () => {
      setSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderApp('/register');
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('redirects authenticated admin from /register to /admin', () => {
      setSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderApp('/register');
      expect(screen.getByText(/Welcome back, Admin!/)).toBeInTheDocument();
    });
  });
});