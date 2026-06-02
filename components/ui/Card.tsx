import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glass?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  glass = false,
  gradient = false,
}) => {
  const base =
    'relative rounded-xl overflow-hidden transition-all duration-300';

  const glassStyle = glass
    ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass'
    : 'bg-neutral-900 border border-neutral-800 shadow-card-dark';

  const gradientOverlay = gradient
    ? 'before:absolute before:inset-0 before:bg-gradient-card before:pointer-events-none'
    : '';

  const hoverStyle = hoverable
    ? 'hover:border-primary-600/40 hover:shadow-glow-primary hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${base} ${glassStyle} ${gradientOverlay} ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
