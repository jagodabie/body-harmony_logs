import ControlPointIcon from '@mui/icons-material/ControlPoint';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';

import './index.css';

export type WidgetProps = {
    currentWeight: number;
    bmi: number;
    handleClick: () => void;
}   

export const Widget = ({
    currentWeight = 0,
    bmi = 0,
    handleClick,
}: WidgetProps
) => {
  return (
    <div className="widget__container">
      <div className="widget__header">
      <MonitorWeightIcon/>
        <h3>Body weight</h3>
        <button type="button" className="widget__add-button" onClick={()=>handleClick()}>
          <ControlPointIcon />
        </button>
        </div>
        <div className="widget__body">
            <h1>{`${currentWeight}kg`}</h1>
            <p>Current weight</p>
            <h1>{bmi}</h1>
            <p>BMI</p>
        </div>
    </div>
  );
};