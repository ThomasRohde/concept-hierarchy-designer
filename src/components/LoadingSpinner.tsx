import { motion } from 'framer-motion';
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  color = 'currentColor',
  text
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <motion.div
        className="rounded-full border-t-transparent"
        style={{
          width: size,
          height: size,
          borderWidth: size / 8,
          borderStyle: 'solid',
          borderColor: color,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity
        }}
      />
      {text && <span className="mt-3 text-gray-500">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
