// Reusable Button component

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  full?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  full = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const baseStyles =
    'px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-orange-600 disabled:bg-gray-400',
    secondary: 'bg-secondary text-white hover:bg-blue-900 disabled:bg-gray-400',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:bg-gray-400',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${full ? 'w-full' : ''} ${
        disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${className}`}
    >
      {loading && (
        <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
      )}
      {children}
    </button>
  );
}
