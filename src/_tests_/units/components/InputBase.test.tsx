import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputBase } from '../../../components/InputBase/InputBase';

describe('InputBase', () => {
  describe('rendering', () => {
    it('renders text input by default', () => {
      render(<InputBase name="username" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders textarea when type is "textarea"', () => {
      render(<InputBase name="notes" type="textarea" />);
      expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
    });

    it('renders number input when type is "number"', () => {
      render(<InputBase name="age" type="number" />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<InputBase name="email" label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      const { container } = render(<InputBase name="email" />);
      expect(container.querySelector('.input-base__label')).not.toBeInTheDocument();
    });

    it('renders error message when error prop is provided', () => {
      render(<InputBase name="email" error="Required field" />);
      expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('does not render error when error prop is not provided', () => {
      const { container } = render(<InputBase name="email" />);
      expect(container.querySelector('.input-base__error')).not.toBeInTheDocument();
    });
  });

  describe('value and filled state', () => {
    it('applies "filled" class when value is provided', () => {
      render(<InputBase name="name" value="John" onChange={vi.fn()} />);
      expect(screen.getByRole('textbox')).toHaveClass('filled');
    });

    it('does not apply "filled" class when value is empty string', () => {
      render(<InputBase name="name" value="" onChange={vi.fn()} />);
      expect(screen.getByRole('textbox')).not.toHaveClass('filled');
    });

    it('floats label when value is present', () => {
      const { container } = render(
        <InputBase name="name" label="Name" value="John" onChange={vi.fn()} />
      );
      expect(container.querySelector('.input-base__label')).toHaveClass('floating');
    });

    it('does not float label when value is empty', () => {
      const { container } = render(
        <InputBase name="name" label="Name" value="" onChange={vi.fn()} />
      );
      expect(container.querySelector('.input-base__label')).not.toHaveClass('floating');
    });
  });

  describe('error state', () => {
    it('applies error modifier class on wrapper when error is set', () => {
      const { container } = render(<InputBase name="email" error="Invalid" />);
      expect(container.querySelector('.input-base__wrapper')).toHaveClass(
        'input-base__wrapper--error'
      );
    });

    it('does not apply error class when no error', () => {
      const { container } = render(<InputBase name="email" />);
      expect(container.querySelector('.input-base__wrapper')).not.toHaveClass(
        'input-base__wrapper--error'
      );
    });
  });

  describe('events', () => {
    it('calls onChange when input value changes', async () => {
      const onChange = vi.fn();
      render(<InputBase name="name" value="" onChange={onChange} />);
      await userEvent.type(screen.getByRole('textbox'), 'A');
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onBlur when input loses focus', async () => {
      const onBlur = vi.fn();
      render(<InputBase name="name" onBlur={onBlur} />);
      await userEvent.click(screen.getByRole('textbox'));
      await userEvent.tab();
      expect(onBlur).toHaveBeenCalled();
    });
  });
});
