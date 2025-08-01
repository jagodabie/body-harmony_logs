import { useWeightLogsContext } from '../../context/WeightLogsContext';
import type { FieldConfig } from '../../types';
import { FormBase } from '../FormBase/FormBase';

import './index.css';

type GenericLogDrawerProps<T> = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (log: T) => void;
  defaultValues: T;
  fields: FieldConfig[];
};

const GenericLogDrawer = <T,>({
  isOpen,
  onClose,
  title,
  onSave,
  defaultValues,
  fields,
}: GenericLogDrawerProps<T>) => {
  const context = useWeightLogsContext();

  if (!context) {
    console.error('WeightLogsContext is not available');
    return null;
  }

  const { success, loading } = context;
  if (!isOpen) return null;

  return (
      <div className="weight-log-drawer">
 
    { loading ? <div>Loading...</div> : success ? <div>Success</div> : <FormBase<T>
        formTitle={title}
        fields={fields}
        defaultValues={defaultValues}
        onSubmit={onSave}
        handleClose={onClose}
      /> }

      </div>
    
  );
};

export default GenericLogDrawer;