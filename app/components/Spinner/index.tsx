interface SpinnerProps {
  size?: number; // em pixels
  className?: string;
  color?: string; // ex: 'white', 'gray-800', etc.
}

export default function Spinner({
  size = 20,
  className = '',
  color = 'white',
}: SpinnerProps) {
  const borderWidth = Math.max(2, Math.round(size / 10)); // proporcional

  return (
    <div
      data-testid="spinner" 
      style={{
        width: size,
        height: size,
        borderWidth: borderWidth,
      }}
      className={`border-${color} border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}
