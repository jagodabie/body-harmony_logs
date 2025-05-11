import './index.css';

type InputBaseProps = {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    value?: string | number;
    rows?: number;
    required?: boolean
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const InputBase = ({
    name,
    label,
    type = 'text',
    rows = 4,
    placeholder,
    value,
    onChange,
    required = false,
}:InputBaseProps) => {
    return (
        <div className="input-base__container">
            {label && <label htmlFor={name}>{label}</label>}
            {type === 'textarea' ? (
                <textarea
                    className="input-base__input"
                    id={name}
                    required={required}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                />
            ) : (
                <input
                    className="input-base__input"
                    id={name}
                    name={name}
                    required={required}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    );
};