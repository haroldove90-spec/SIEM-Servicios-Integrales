import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showLockIcon?: boolean;
  className?: string;
  containerClassName?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showLockIcon = false,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative flex items-center ${containerClassName}`}>
      {showLockIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-4 h-4" />
        </div>
      )}
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={`${showLockIcon ? 'pl-9' : 'pl-3'} pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer focus:outline-none transition-colors"
        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4 text-slate-600" />
        ) : (
          <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600" />
        )}
      </button>
    </div>
  );
};
