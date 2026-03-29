import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FormBase } from '../../../components/FormBase/FormBase';
import type { FieldConfig } from '../../../types';

type FormData = { value: string; notes: string };

const FIELDS: FieldConfig[] = [
  { name: 'value', label: 'Value', type: 'text' },
  { name: 'notes', label: 'Notes', type: 'text' },
];

const FIELDS_WITH_VALIDATOR: FieldConfig[] = [
  {
    name: 'value',
    label: 'Value',
    type: 'text',
    validator: v => (!v ? 'Value is required' : ''),
  },
];

describe('FormBase', () => {
  describe('rendering', () => {
    it('renders all fields', () => {
      render(
        <FormBase<FormData>
          fields={FIELDS}
          onSubmit={vi.fn()}
          handleClose={vi.fn()}
        />
      );
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(
        <FormBase<FormData>
          formTitle="Add Log"
          fields={FIELDS}
          onSubmit={vi.fn()}
          handleClose={vi.fn()}
        />
      );
      expect(screen.getByText('Add Log')).toBeInTheDocument();
    });

    it('renders footer by default', () => {
      render(
        <FormBase<FormData>
          fields={FIELDS}
          onSubmit={vi.fn()}
          handleClose={vi.fn()}
        />
      );
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('hides footer when showFooter=false', () => {
      render(
        <FormBase<FormData>
          fields={FIELDS}
          onSubmit={vi.fn()}
          handleClose={vi.fn()}
          showFooter={false}
        />
      );
      expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
    });
  });

  describe('defaultValues', () => {
    it('pre-fills inputs with defaultValues', () => {
      render(
        <FormBase<FormData>
          fields={FIELDS}
          defaultValues={{ value: '75', notes: 'feeling good' }}
          onSubmit={vi.fn()}
          handleClose={vi.fn()}
        />
      );
      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0]).toHaveValue('75');
      expect(inputs[1]).toHaveValue('feeling good');
    });
  });

  describe('submission', () => {
    it('calls onSubmit with form data when submitted', async () => {
      const onSubmit = vi.fn();
      render(
        <FormBase<FormData>
          fields={FIELDS}
          onSubmit={onSubmit}
          handleClose={vi.fn()}
        />
      );
      const [valueInput, notesInput] = screen.getAllByRole('textbox');
      await userEvent.type(valueInput, '80');
      await userEvent.type(notesInput, 'test note');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
      expect(onSubmit).toHaveBeenCalledWith({ value: '80', notes: 'test note' });
    });

    it('calls handleClose after successful submission', async () => {
      const handleClose = vi.fn();
      render(
        <FormBase<FormData>
          fields={FIELDS}
          onSubmit={vi.fn()}
          handleClose={handleClose}
        />
      );
      // Fill a field so the footer Submit button becomes enabled
      await userEvent.type(screen.getAllByRole('textbox')[0], '80');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
      expect(handleClose).toHaveBeenCalled();
    });

    it('shows validation error and does not submit when validator fails', async () => {
      const onSubmit = vi.fn();
      render(
        <FormBase<{ value: string }>
          fields={FIELDS_WITH_VALIDATOR}
          onSubmit={onSubmit}
          handleClose={vi.fn()}
        />
      );
      // Use the header check-mark submit (always enabled) with empty value
      const submitButtons = screen.getAllByRole('button', { name: '' });
      const headerSubmit = submitButtons.find(
        b => b.getAttribute('type') === 'submit'
      )!;
      await userEvent.click(headerSubmit);
      expect(screen.getByText('Value is required')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('close / cancel', () => {
    it('calls handleClose when Cancel is clicked', async () => {
      const handleClose = vi.fn();
      render(
        <FormBase<FormData>
          fields={FIELDS}
          onSubmit={vi.fn()}
          handleClose={handleClose}
        />
      );
      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(handleClose).toHaveBeenCalled();
    });

    it('calls handleClose when back arrow button is clicked', async () => {
      const handleClose = vi.fn();
      render(
        <FormBase<FormData>
          fields={FIELDS}
          onSubmit={vi.fn()}
          handleClose={handleClose}
        />
      );
      // The back arrow is the first button in FormHeader
      const buttons = screen.getAllByRole('button');
      await userEvent.click(buttons[0]);
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
