import type { WeightLog } from '../../types/WeightLog';
import { FormBase } from '../FormBase/FormBase';
import { defaultValuesConverter, formFields } from './utils';

import './index.css';

type WeightLogEditModalProps = {
  weightLog: WeightLog;
  onClose: () => void;
};

const onSave = (weightLog: WeightLog) => {
  console.log(weightLog);
};

const WeightLogEditDrawer = ({ weightLog, onClose }: WeightLogEditModalProps) => {
  return <div className='weight-log-edit-drawer'>
    <FormBase
      formTitle="Edit Weight Log"
      fields={formFields(weightLog.type)}
      defaultValues={defaultValuesConverter(weightLog)}
      onSubmit={()=> onSave(weightLog)}
      handleClose={onClose}
    />
    </div>;
};

export default WeightLogEditDrawer;