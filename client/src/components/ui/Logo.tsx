import React from 'react';
import logo from '@/assets/logo.png';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-14',
};

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logo} alt="ServiceBridge" className={`${sizeMap[size]} w-auto object-contain`} />
    </div>
  );
};
