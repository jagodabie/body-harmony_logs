import { useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import type { FieldConfig } from '../../types';
import type { Nullable } from '../../types/WeightLog';
import { InputBase } from '../InputBase/InputBase';

import './index.css';

type FormBaseProps<TForm> = {
  formTitle?: string;
  fields: FieldConfig[];
  defaultValues?: Partial<TForm> | Nullable<TForm>;
  onSubmit: (formData: TForm) => void;
  handleClose: () => void;
};

export const FormBase = <TForm,>({
  formTitle,
  fields,
  onSubmit,
  defaultValues,
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
    // setFormData(Object.fromEntries(fields.map((field) => [field.name, ''])));
  };

  return (
    <form className="form-base__container" onSubmit={handleSubmit}>
      <div className="header form-base__header">
        <div className="header-button" onClick={() => handleClose()}>
          <CloseIcon />
          <h3>{formTitle}</h3>
        </div>
      </div>
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
      <div className="form-base__footer">
        <button className="primary-button" type="submit" disabled={canSubmit}>
          Submit
        </button>
        <button className="cancel-button" type="button" onClick={() => handleClose()}>
          Cancel
        </button>
      </div>
    </form> 
  );
};
