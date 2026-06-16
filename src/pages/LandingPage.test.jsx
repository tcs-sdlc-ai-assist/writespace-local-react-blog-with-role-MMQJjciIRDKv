import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import { addPost, clearSession, setSession } from '../utils/storage.js';

/**
 * Helper to render LandingPage wrapped in MemoryRouter.
 * @returns {import('@testing-library/react').RenderResult}
 */
function renderLandingPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LandingPage />
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  beforeEach(() => {
    localStorage.clear();
    clearSession();
  });

  // ─── Hero Section ─────────────────────────────────────────────────────────

  describe('hero section', () => {
    it('renders the WriteSpace heading', () => {
      renderLandingPage();
      const headings = screen.getAllByText('WriteSpace');
      expect(headings.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the hero tagline', () => {
      renderLandingPage();
      expect(
        screen.getByText(/Your creative writing space/i)
      ).toBeInTheDocument();
    });

    it('renders the Get Started link', () => {
      renderLandingPage();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Get Started').closest('a')).toHaveAttribute(
        'href',
        '/register'
      );
    });

    it('renders the Login link in hero section', () => {
      renderLandingPage();
      const loginLinks = screen.getAllByText('Login');
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
      const heroLogin = loginLinks.find(
        (el) => el.closest('a') && el.closest('a').getAttribute('href') === '/login'
      );
      expect(heroLogin).toBeDefined();
    });
  });

  // ─── Features Section ────────────────────────────────────────────────────

  describe('features section', () => {
    it('renders the "Why WriteSpace?" heading', () => {
      renderLandingPage();
      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
    });

    it('renders the Write Freely feature card', () => {
      renderLandingPage();
      expect(screen.getByText('Write Freely')).toBeInTheDocument();
      expect(
        screen.getByText(/Create and publish blog posts in a clean/i)
      ).toBeInTheDocument();
    });

    it('renders the Role-Based Access feature card', () => {
      renderLandingPage();
      expect(screen.getByText('Role-Based Access')).toBeInTheDocument();
      expect(
        screen.getByText(/Admins manage users and all content/i)
      ).toBeInTheDocument();
    });

    it('renders the Local Storage feature card', () => {
      renderLandingPage();
      expect(screen.getByText('Local Storage')).toBeInTheDocument();
      expect(
        screen.getByText(/Your data stays in your browser/i)
      ).toBeInTheDocument();
    });
  });

  // ─── Latest Posts Section (empty state) ──────────────────────────────────

  describe('latest posts section - empty state', () => {
    it('renders the Latest Posts heading', () => {
      renderLandingPage();
      expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    });

    it('shows empty state message when no posts exist', () => {
      renderLandingPage();
      expect(
        screen.getByText('No posts yet. Be the first to share your story!')
      ).toBeInTheDocument();
    });

    it('shows Start Writing link in empty state', () => {
      renderLandingPage();
      expect(screen.getByText('Start Writing')).toBeInTheDocument();
      expect(screen.getByText('Start Writing').closest('a')).toHaveAttribute(
        'href',
        '/register'
      );
    });
  });

  // ─── Latest Posts Section (with posts) ───────────────────────────────────

  describe('latest posts section - with posts', () => {
    beforeEach(() => {
      const posts = [
        {
          id: 'post-1',
          title: 'First Blog Post',
          content: 'Content of the first blog post.',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'user-1',
          authorName: 'Alice',
        },
        {
          id: 'post-2',
          title: 'Second Blog Post',
          content: 'Content of the second blog post.',
          createdAt: '2024-06-02T10:00:00.000Z',
          authorId: 'user-2',
          authorName: 'Bob',
        },
        {
          id: 'post-3',
          title: 'Third Blog Post',
          content: 'Content of the third blog post.',
          createdAt: '2024-06-03T10:00:00.000Z',
          authorId: 'admin',
          authorName: 'Admin',
        },
      ];
      posts.forEach((p) => addPost(p));
    });

    it('renders post titles in the latest posts section', () => {
      renderLandingPage();
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Third Blog Post')).toBeInTheDocument();
    });

    it('renders post author names', () => {
      renderLandingPage();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('does not show empty state when posts exist', () => {
      renderLandingPage();
      expect(
        screen.queryByText('No posts yet. Be the first to share your story!')
      ).not.toBeInTheDocument();
    });

    it('shows at most 3 latest posts', () => {
      const extraPost = {
        id: 'post-4',
        title: 'Fourth Blog Post',
        content: 'Content of the fourth blog post.',
        createdAt: '2024-05-01T10:00:00.000Z',
        authorId: 'user-1',
        authorName: 'Alice',
      };
      addPost(extraPost);

      renderLandingPage();
      // The 3 newest posts should be shown (post-3, post-2, post-1), not post-4
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Third Blog Post')).toBeInTheDocument();
      expect(screen.queryByText('Fourth Blog Post')).not.toBeInTheDocument();
    });

    it('renders posts sorted by newest first', () => {
      renderLandingPage();
      const postTitles = screen.getAllByRole('heading', { level: 3 });
      const titleTexts = postTitles.map((h) => h.textContent);
      const thirdIndex = titleTexts.indexOf('Third Blog Post');
      const secondIndex = titleTexts.indexOf('Second Blog Post');
      const firstIndex = titleTexts.indexOf('First Blog Post');
      expect(thirdIndex).toBeLessThan(secondIndex);
      expect(secondIndex).toBeLessThan(firstIndex);
    });
  });

  // ─── Footer ──────────────────────────────────────────────────────────────

  describe('footer', () => {
    it('renders the footer with copyright text', () => {
      renderLandingPage();
      const currentYear = new Date().getFullYear().toString();
      expect(
        screen.getByText(new RegExp(`© ${currentYear} WriteSpace`))
      ).toBeInTheDocument();
    });

    it('renders the Home footer link', () => {
      renderLandingPage();
      const homeLinks = screen.getAllByText('Home');
      const footerHome = homeLinks.find(
        (el) => el.closest('a') && el.closest('a').getAttribute('href') === '/'
      );
      expect(footerHome).toBeDefined();
    });

    it('renders the Login footer link', () => {
      renderLandingPage();
      const loginLinks = screen.getAllByText('Login');
      const footerLogin = loginLinks.find(
        (el) => el.closest('a') && el.closest('a').getAttribute('href') === '/login'
      );
      expect(footerLogin).toBeDefined();
    });

    it('renders the Register footer link', () => {
      renderLandingPage();
      const registerLinks = screen.getAllByText('Register');
      const footerRegister = registerLinks.find(
        (el) => el.closest('a') && el.closest('a').getAttribute('href') === '/register'
      );
      expect(footerRegister).toBeDefined();
    });
  });

  // ─── PublicNavbar integration ────────────────────────────────────────────

  describe('public navbar', () => {
    it('shows Login and Register links in navbar when not authenticated', () => {
      renderLandingPage();
      const navLoginLinks = screen.getAllByText('Login');
      expect(navLoginLinks.length).toBeGreaterThanOrEqual(1);
      const navRegisterLinks = screen.getAllByText('Register');
      expect(navRegisterLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('shows Dashboard link in navbar for authenticated admin', () => {
      setSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderLandingPage();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('shows My Blogs link in navbar for authenticated regular user', () => {
      setSession({
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderLandingPage();
      expect(screen.getByText('My Blogs')).toBeInTheDocument();
    });
  });
});