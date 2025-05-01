import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Sidebar from './index';

// Mock do next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock do componente ThemeToggle
vi.mock('../ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock do next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    [key: string]: unknown;
  }) => (
    <a onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

// Mock do lucide-react
vi.mock('lucide-react', () => ({
  X: () => <div data-testid="close-icon" />,
}));

describe('Sidebar', () => {
  const mockNavLinks = [
    { label: 'Filmes', href: '/movies' },
    { label: '+ Novo', href: '/movies/new' },
  ];

  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onLogout: vi.fn(),
    navLinks: mockNavLinks,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as Mock).mockReturnValue('/movies');
  });

  it('should not render when open is false', () => {
    render(<Sidebar {...defaultProps} open={false} />);
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    render(<Sidebar {...defaultProps} />);
    mockNavLinks.forEach((link) => {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    });
  });

  it('should apply active style to current path link', () => {
    render(<Sidebar {...defaultProps} />);
    const activeLink = screen.getByText('Filmes');
    expect(activeLink.className).toContain('bg-blue-600');
    expect(activeLink.className).toContain('text-white');
  });

  it('should call onClose when close button is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    const closeButton = screen.getByTestId('close-icon').parentElement;
    fireEvent.click(closeButton!);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when a navigation link is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    const link = screen.getByText('Filmes');
    fireEvent.click(link);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call both onLogout and onClose when logout button is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    const logoutButton = screen.getByText('Sair');
    fireEvent.click(logoutButton);
    expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should render ThemeToggle component', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('should have correct overlay and sidebar structure', () => {
    render(<Sidebar {...defaultProps} />);

    // Verificar o overlay (container externo)
    const overlay = screen.getByText('Menu').closest('.fixed.inset-0');
    expect(overlay).toHaveClass('bg-black', 'bg-opacity-50', 'z-50', 'md:hidden');

    // Verificar o container da sidebar
    const sidebarContainer = screen.getByText('Menu').closest('.fixed.left-0');
    expect(sidebarContainer).toHaveClass(
      'fixed',
      'left-0',
      'top-0',
      'w-64',
      'h-full',
      'bg-white',
      'dark:bg-gray-900',
    );
  });

  it('should have correct header structure', () => {
    render(<Sidebar {...defaultProps} />);
    const header = screen.getByText('Menu').parentElement;
    expect(header).toHaveClass('flex', 'justify-between', 'items-center', 'mb-6');
  });

  it('should have correct navigation link styles', () => {
    render(<Sidebar {...defaultProps} />);
    const activeLink = screen.getByText('Filmes');
    expect(activeLink).toHaveClass(
      'text-sm',
      'font-medium',
      'px-3',
      'py-2',
      'rounded',
      'bg-blue-600',
      'text-white',
    );
  });

  it('should have correct logout button styles', () => {
    render(<Sidebar {...defaultProps} />);
    const logoutButton = screen.getByText('Sair');
    expect(logoutButton).toHaveClass(
      'text-sm',
      'font-medium',
      'px-3',
      'py-2',
      'rounded',
      'bg-red-500',
      'text-white',
    );
  });
});
