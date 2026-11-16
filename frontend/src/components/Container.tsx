interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: boolean;
  minHeight?: boolean;
}
export default function Container({
  children,
  className,
  maxWidth = true,
  minHeight = true,
}: ContainerProps) {
  return (
    <div
      className={`relative z-10 mx-auto flex ${minHeight ? "min-h-svh" : ""} w-full ${maxWidth ? "max-w-7xl" : ""} flex-col ${className}`}
    >
      {children}
    </div>
  );
}
