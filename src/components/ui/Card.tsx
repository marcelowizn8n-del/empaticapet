type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
};

export default function Card({ children, className = "", padding = true }: CardProps) {
  return (
    <div className={`bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 ${padding ? "p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}
