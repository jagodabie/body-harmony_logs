import type { FieldConfig } from '../../types';
import type { Nullable } from '../../types/WeightLog';
import { FormBase } from '../FormBase/FormBase';

import './index.css';

type GenericLogModalProps<T> = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (log: T) => void;
  defaultValues: Nullable<T>;
  fields: FieldConfig[];
};

const GenericLogModal = <T,>({
  isOpen,
  onClose,
  title,
  onSave,
  defaultValues,
  fields,
}: GenericLogModalProps<T>) => {
  if (!isOpen) return null;

  return (
    <div className="weight-log-modal__container">
      <div className="weight-log-modal">
        <FormBase<T>
          showFooter={false}
          formTitle={title}
          fields={fields}
          defaultValues={defaultValues}
          onSubmit={onSave}
          handleClose={onClose}
        />
      </div>
    </div>
  );
};

export default GenericLogModal;
