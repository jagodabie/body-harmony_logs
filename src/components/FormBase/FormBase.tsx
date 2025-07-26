import { useEffect, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import type { FieldConfig } from '../../types';
import { InputBase } from '../InputBase/InputBase';

import './index.css';

type FormBaseProps = {
  formTitle?: string;
  fields: FieldConfig[];
  defaultValues?: Record<string, unknown>;
  onSubmit: (formData: Record<string, unknown>) => void;
  handleClose: () => void;
};

export const FormBase = ({
  formTitle,
  fields,
  onSubmit,
  defaultValues,
  handleClose,
}: FormBaseProps) => {
  const [formData, setFormData] = useState<
    Record<string, string | number | null>
  >(Object.fromEntries(fields.map((field) => [field.name, ''])));

  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues as Record<string, string | number | null>);
    }
  }, [defaultValues]);

  const canSubmit = useMemo(() => {
    return !Object.values(formData).some(
      (value) => value !== null && value !== ''
    );
  }, [formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form-base__container" onSubmit={handleSubmit}>
      <div className="header form-base__header">
        <div className="header-button" onClick={() => handleClose()}>
          <CloseIcon />
          <h3>{formTitle}</h3>
        </div>
      </div>
      {fields.map((field) => (
        <InputBase
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type}
          required={field?.required}
          placeholder={field.placeholder}
          value={formData[field.name] || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [field.name]: e.target.value,
            }))
          }
        />
      ))}
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
