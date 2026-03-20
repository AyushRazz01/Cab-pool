// Loading spinner component

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
