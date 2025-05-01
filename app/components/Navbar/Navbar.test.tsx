import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from './index';

// Mock dos módulos next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

// Mock do componente ThemeToggle
vi.mock('../ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock do componente Sidebar
vi.mock('../Sidebar', () => ({
  default: ({
    open,
    onClose,
    onLogout,
  }: {
    open: boolean;
    onClose: () => void;
    onLogout: () => void;
  }) => (
    <div data-testid="sidebar" data-open={open}>
      <button onClick={onClose}>Close Sidebar</button>
      <button onClick={onLogout}>Logout from Sidebar</button>
    </div>
  ),
}));

// Mock do componente Menu do lucide-react
vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon" />,
}));

describe('Navbar', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup dos mocks
    (useRouter as Mock).mockReturnValue(mockRouter);
    (usePathname as Mock).mockReturnValue('/movies');
  });

  it('renders the logo text', () => {
    render(<Navbar />);
    expect(screen.getByText('🎬 Cubos Filmes')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Filmes')).toBeInTheDocument();
    expect(screen.getByText('+ Novo')).toBeInTheDocument();
  });

  it('applies active style to current path link', () => {
    render(<Navbar />);
    const moviesLink = screen.getByText('Filmes');
    expect(moviesLink.className).toContain('bg-blue-600');
  });

  it('handles logout correctly', () => {
    render(<Navbar />);
    const logoutButton = screen.getByText('Sair');

    fireEvent.click(logoutButton);

    expect(localStorage.getItem('token')).toBeNull();
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('opens sidebar when menu button is clicked', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Abrir menu');

    fireEvent.click(menuButton);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.getAttribute('data-open')).toBe('true');
  });

  it('closes sidebar when close button is clicked', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Abrir menu');

    // Abrir sidebar
    fireEvent.click(menuButton);

    // Fechar sidebar
    const closeButton = screen.getByText('Close Sidebar');
    fireEvent.click(closeButton);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.getAttribute('data-open')).toBe('false');
  });

  it('handles logout from sidebar correctly', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Abrir menu');

    // Abrir sidebar
    fireEvent.click(menuButton);

    // Logout pela sidebar
    const sidebarLogoutButton = screen.getByText('Logout from Sidebar');
    fireEvent.click(sidebarLogoutButton);

    expect(localStorage.getItem('token')).toBeNull();
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });
});
