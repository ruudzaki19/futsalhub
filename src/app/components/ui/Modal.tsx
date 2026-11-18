// src/app/components/ui/Modal.tsx
'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200">
      <div 
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-[#13192B] border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] rounded-2xl shadow-hard-lg-navy dark:shadow-none p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 text-left">
            {title && (
              <h3 className="text-lg font-black text-[#0E1220] dark:text-[#F3F4F6] tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[#5B6478] dark:text-[#94A3B8]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#E3E7EF] dark:border-[#1E263D] text-stone-400 hover:text-[#0E1220] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
