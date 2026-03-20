// Input component

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  maxLength?: number;
  name?: string;
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  label,
  maxLength,
  name,
}: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      />
    </div>
  );
}
