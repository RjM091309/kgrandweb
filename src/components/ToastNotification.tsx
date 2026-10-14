import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Bell, CheckCircle2 } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { notification } = useHotel();

  if (!notification) return null;

  return (
    <div className="fixed bottom-[calc(104px+env(safe-area-inset-bottom))] left-4 right-4 sm:left-auto sm:right-6 lg:bottom-6 z-50 max-w-md bg-stone-900/95 border border-amber-500/40 text-stone-100 shadow-2xl rounded-lg p-4 flex items-start gap-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
      <div className="text-xs leading-relaxed text-stone-200">
        <p className="font-semibold text-stone-100">Aurelia Grand Concierge</p>
        <p className="mt-0.5 text-stone-300">{notification}</p>
      </div>
    </div>
  );
};
