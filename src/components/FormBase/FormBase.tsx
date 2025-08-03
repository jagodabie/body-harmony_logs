import { useMemo, useState } from 'react';

import type { FieldConfig } from '../../types';
import type { Nullable } from '../../types/WeightLog';
import { FormFooter } from '../FormFooter/FormFooter';
import { FormHeader } from '../FormHeader/FormHeader';
import { InputBase } from '../InputBase/InputBase';

import './index.css';

type FormBaseProps<TForm> = {
  formTitle?: string;
  fields: FieldConfig[];
  showFooter?: boolean;
  defaultValues?: Partial<TForm> | Nullable<TForm>;
  onSubmit: (formData: TForm) => void;
  handleClose: () => void;
};

export const FormBase = <TForm,>({
  formTitle,
  fields,
  onSubmit,
  defaultValues,
  showFooter = true,
  handleClose,
}: FormBaseProps<TForm>) => {
  const [formData, setFormData] = useState<TForm>(
    (defaultValues as TForm) ||
      (Object.fromEntries(fields.map((field) => [field.name, ''])) as TForm)
  );

  const canSubmit = useMemo(() => {
    return !Object.values(formData as Record<string, unknown>).some(
      (value) => value !== null && value !== ''
    );
  }, [formData]);

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
    handleClose();
  };

  const handleConfirm = async() => {
    await onSubmit(formData);
    handleClose();
  };

  return (
    <form className="form-base__container" onSubmit={handleSubmit}>
      <FormHeader
        title={formTitle}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
      <div className="form-base__body">
        {fields.map((field) => {
          const name = field.name as keyof TForm;
          return (
            <InputBase
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[name]?.toString() || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [name]: e.target.value,
                }))
              }
            />
          );
        })}
      </div>
      {showFooter && (
        <FormFooter canSubmit={canSubmit} onCancel={handleClose} />
      )}
    </form>
  );
};
