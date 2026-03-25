import './index.css';

type MacroBarProps = {
  label: string;
  consumed: number;
  goal: number;
  unit?: string;
};

export const MacroBar = ({ label, consumed, goal, unit = 'g' }: MacroBarProps) => {
  const percent = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;

  return (
    <div className="macro-bar">
      <div className="macro-bar__row">
        <span className="macro-bar__label">{label}</span>
        <span className="macro-bar__value">
          {consumed}/{goal}{unit}
        </span>
      </div>
      <div className="macro-bar__track">
        <div
          className="macro-bar__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
