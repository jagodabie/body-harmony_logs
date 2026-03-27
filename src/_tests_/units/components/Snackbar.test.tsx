import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Snackbar } from '../../../components/Snackbar/Snackbar';

const defaultSnackbar = { message: 'Operation successful', type: 'success' as const };

describe('Snackbar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders the message', () => {
      render(<Snackbar snackbar={defaultSnackbar} onClose={vi.fn()} />);
      expect(screen.getByText('Operation successful')).toBeInTheDocument();
    });

    it('applies the type as CSS class', () => {
      const { container } = render(
        <Snackbar snackbar={defaultSnackbar} onClose={vi.fn()} />
      );
      expect(container.querySelector('.snackbar')).toHaveClass('success');
    });

    it('renders error type class', () => {
      const { container } = render(
        <Snackbar
          snackbar={{ message: 'Error', type: 'error' }}
          onClose={vi.fn()}
        />
      );
      expect(container.querySelector('.snackbar')).toHaveClass('error');
    });

    it('renders close button', () => {
      render(<Snackbar snackbar={defaultSnackbar} onClose={vi.fn()} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('auto-close timer', () => {
    it('is visible before duration elapses', () => {
      render(<Snackbar snackbar={defaultSnackbar} onClose={vi.fn()} duration={3000} />);
      act(() => {
        vi.advanceTimersByTime(2999);
      });
      expect(screen.getByText('Operation successful')).toBeInTheDocument();
    });

    it('disappears after duration elapses', () => {
      render(<Snackbar snackbar={defaultSnackbar} onClose={vi.fn()} duration={3000} />);
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();
    });

    it('defaults to 4000ms duration', () => {
      render(<Snackbar snackbar={defaultSnackbar} onClose={vi.fn()} />);
      act(() => {
        vi.advanceTimersByTime(3999);
      });
      expect(screen.getByText('Operation successful')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<Snackbar snackbar={defaultSnackbar} onClose={onClose} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('mouse interactions', () => {
    it('hides snackbar on mouse enter', () => {
      render(<Snackbar snackbar={defaultSnackbar} onClose={vi.fn()} />);
      const snackbar = screen.getByText('Operation successful').closest('.snackbar')!;
      act(() => {
        fireEvent.mouseEnter(snackbar);
      });
      expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();
    });
  });
});
