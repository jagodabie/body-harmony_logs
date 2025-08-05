import clsx from 'clsx';

import './index.css';

type InputBaseProps = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  rows?: number;
  required?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
};

export const InputBase = ({
  name,
  label,
  type = 'text',
  rows = 4,
  value,
  onBlur,
  onChange,
  required = false,
  error,
}: InputBaseProps) => {
  const hasValue = value !== '' && value !== undefined;

  return (
    <div className="input-base__container">
      <div className={clsx('input-base__wrapper', { 'input-base__wrapper--error': error })}>
        {type === 'textarea' ? (
          <textarea
            className={clsx('input-base__input', { filled: hasValue })}
            id={name}
            required={required}
            name={name}
            placeholder=" "
            value={value}
            onChange={onChange}
            rows={rows}
            onBlur={onBlur}
          />
        ) : (
          <input
            className={clsx('input-base__input', { filled: hasValue })}
            id={name}
            name={name}
            required={required}
            type={type}
            placeholder=" "
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
        {label && (
          <span className={clsx('input-base__label', { floating: hasValue })}>
            {label}
          </span>
        )}
      </div>
      {error && (
        <p className="input-base__error">{error}</p>
      )}
    </div>
  );
};
