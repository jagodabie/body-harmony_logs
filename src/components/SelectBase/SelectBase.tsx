import clsx from 'clsx';

import './index.css';

type SelectOption = {
  value: string;
  label: string;
};

type SelectBaseProps = {
  name: string;
  label?: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
};

export const SelectBase = ({
  name,
  label,
  value,
  options,
  placeholder = 'Select an option',
  required = false,
  onChange,
  onBlur,
  error,
}: SelectBaseProps) => {
  const hasValue = value !== '' && value !== undefined;

  return (
    <div className="select__container">
      <div className={clsx('select__wrapper', { 'select__wrapper--error': error })}>
        <select
          className={clsx('select__input', { filled: hasValue })}
          id={name}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {label && (
          <span className={clsx('select__label', { floating: hasValue })}>
            {label}
          </span>
        )}
      </div>
      {error && <p className="select__error">{error}</p>}
    </div>
  );
};

