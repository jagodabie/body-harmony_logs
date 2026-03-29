import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { GenericLogModal } from '../../../components/GenericLogModal/GenericLogModal';
import type { FieldConfig } from '../../../types';

type LogForm = { value: string };

const FIELDS: FieldConfig[] = [{ name: 'value', label: 'Value', type: 'text' }];

describe('GenericLogModal', () => {
  describe('visibility', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(
        <GenericLogModal<LogForm>
          isOpen={false}
          title="Add Weight"
          onClose={vi.fn()}
          onSave={vi.fn()}
          defaultValues={null}
          fields={FIELDS}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders modal when isOpen is true', () => {
      render(
        <GenericLogModal<LogForm>
          isOpen
          title="Add Weight"
          onClose={vi.fn()}
          onSave={vi.fn()}
          defaultValues={null}
          fields={FIELDS}
        />
      );
      expect(screen.getByText('Add Weight')).toBeInTheDocument();
    });
  });

  describe('content', () => {
    it('renders the form title', () => {
      render(
        <GenericLogModal<LogForm>
          isOpen
          title="Edit Log"
          onClose={vi.fn()}
          onSave={vi.fn()}
          defaultValues={null}
          fields={FIELDS}
        />
      );
      expect(screen.getByText('Edit Log')).toBeInTheDocument();
    });

    it('renders form fields', () => {
      render(
        <GenericLogModal<LogForm>
          isOpen
          title="Add Weight"
          onClose={vi.fn()}
          onSave={vi.fn()}
          defaultValues={null}
          fields={FIELDS}
        />
      );
      expect(screen.getByText('Value')).toBeInTheDocument();
    });

    it('pre-fills form with defaultValues', () => {
      render(
        <GenericLogModal<LogForm>
          isOpen
          title="Edit Weight"
          onClose={vi.fn()}
          onSave={vi.fn()}
          defaultValues={{ value: '75' }}
          fields={FIELDS}
        />
      );
      expect(screen.getByRole('textbox')).toHaveValue('75');
    });
  });

  describe('backdrop click', () => {
    it('calls onClose when clicking the backdrop', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <GenericLogModal<LogForm>
          isOpen
          title="Add Weight"
          onClose={onClose}
          onSave={vi.fn()}
          defaultValues={null}
          fields={FIELDS}
        />
      );
      const backdrop = container.querySelector('.weight-log-modal__container')!;
      await userEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    });
  });
});
