// Error alert component

interface AlertProps {
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  onClose?: () => void;
}

export default function Alert({ message, type = 'error', onClose }: AlertProps) {
  const styles = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${styles[type]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm">{message}</p>
        {onClose && (
          <button onClick={onClose} className="text-lg font-semibold">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
