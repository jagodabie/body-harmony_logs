import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SelectBase } from '../../../components/SelectBase/SelectBase';

const OPTIONS = [
  { value: 'kg', label: 'Kilograms' },
  { value: 'lbs', label: 'Pounds' },
];

describe('SelectBase', () => {
  describe('rendering', () => {
    it('renders a select element', () => {
      render(<SelectBase name="unit" options={OPTIONS} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders all options', () => {
      render(<SelectBase name="unit" options={OPTIONS} />);
      expect(screen.getByRole('option', { name: 'Kilograms' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Pounds' })).toBeInTheDocument();
    });

    it('renders placeholder as disabled option', () => {
      render(<SelectBase name="unit" options={OPTIONS} placeholder="Pick one" />);
      const placeholder = screen.getByRole('option', { name: 'Pick one' });
      expect(placeholder).toBeDisabled();
    });

    it('uses default placeholder when not provided', () => {
      render(<SelectBase name="unit" options={OPTIONS} />);
      expect(screen.getByRole('option', { name: 'Select an option' })).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<SelectBase name="unit" label="Unit" options={OPTIONS} />);
      expect(screen.getByText('Unit')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      const { container } = render(<SelectBase name="unit" options={OPTIONS} />);
      expect(container.querySelector('.select__label')).not.toBeInTheDocument();
    });

    it('renders error message when error is provided', () => {
      render(<SelectBase name="unit" options={OPTIONS} error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  describe('filled state', () => {
    it('applies "filled" class when value is set', () => {
      render(<SelectBase name="unit" options={OPTIONS} value="kg" onChange={vi.fn()} />);
      expect(screen.getByRole('combobox')).toHaveClass('filled');
    });

    it('does not apply "filled" class when value is empty', () => {
      render(<SelectBase name="unit" options={OPTIONS} value="" onChange={vi.fn()} />);
      expect(screen.getByRole('combobox')).not.toHaveClass('filled');
    });

    it('floats label when value is present', () => {
      const { container } = render(
        <SelectBase name="unit" label="Unit" options={OPTIONS} value="kg" onChange={vi.fn()} />
      );
      expect(container.querySelector('.select__label')).toHaveClass('floating');
    });
  });

  describe('error state', () => {
    it('applies error modifier class on wrapper when error is set', () => {
      const { container } = render(
        <SelectBase name="unit" options={OPTIONS} error="Invalid" />
      );
      expect(container.querySelector('.select__wrapper')).toHaveClass(
        'select__wrapper--error'
      );
    });
  });

  describe('events', () => {
    it('calls onChange when selection changes', async () => {
      const onChange = vi.fn();
      render(<SelectBase name="unit" options={OPTIONS} value="" onChange={onChange} />);
      await userEvent.selectOptions(screen.getByRole('combobox'), 'kg');
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onBlur when select loses focus', async () => {
      const onBlur = vi.fn();
      render(<SelectBase name="unit" options={OPTIONS} onBlur={onBlur} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.tab();
      expect(onBlur).toHaveBeenCalled();
    });
  });
});
