import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../../../components/Button/Button';

describe('Button', () => {
  describe('label', () => {
    it('renders label text', () => {
      render(<Button label="Click me" onClick={vi.fn()} />);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders without label', () => {
      render(<Button onClick={vi.fn()} />);
      expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
    });
  });

  describe('onClick', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      render(<Button label="Submit" onClick={onClick} />);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const onClick = vi.fn();
      render(<Button label="Submit" onClick={onClick} disabled />);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const onClick = vi.fn();
      render(<Button label="Submit" onClick={onClick} loading />);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('button is disabled when disabled prop is true', () => {
      render(<Button label="Submit" onClick={vi.fn()} disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('button is disabled when loading is true', () => {
      render(<Button label="Submit" onClick={vi.fn()} loading />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('button is enabled by default', () => {
      render(<Button label="Submit" onClick={vi.fn()} />);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('loading state', () => {
    it('adds button--loading class when loading', () => {
      render(<Button onClick={vi.fn()} loading />);
      expect(screen.getByRole('button')).toHaveClass('button--loading');
    });

    it('does not have button--loading class when not loading', () => {
      render(<Button onClick={vi.fn()} />);
      expect(screen.getByRole('button')).not.toHaveClass('button--loading');
    });

    it('still renders label when loading (spinner appears alongside)', () => {
      render(<Button label="Save" onClick={vi.fn()} loading />);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  describe('className', () => {
    it('applies custom className alongside base class', () => {
      render(<Button onClick={vi.fn()} className="my-class" />);
      const btn = screen.getByRole('button');
      expect(btn).toHaveClass('button', 'my-class');
    });
  });
});
