"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface UpdateNotificationProps {
  message?: string;
  duration?: number;
}

export default function UpdateNotification({ 
  message = "Dados atualizados com sucesso!", 
  duration = 3000 
}: UpdateNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(message);

  useEffect(() => {
    // Listener para eventos de atualização
    const handleDataUpdate = (event: CustomEvent) => {
      setNotificationMessage(event.detail.message || message);
      setIsVisible(true);
      
      setTimeout(() => {
        setIsVisible(false);
      }, duration);
    };

    // Listener para eventos de refresh
    const handleRefresh = () => {
      setNotificationMessage("Dados recarregados!");
      setIsVisible(true);
      
      setTimeout(() => {
        setIsVisible(false);
      }, duration);
    };

    window.addEventListener('data-updated' as any, handleDataUpdate);
    window.addEventListener('data-refreshed' as any, handleRefresh);

    return () => {
      window.removeEventListener('data-updated' as any, handleDataUpdate);
      window.removeEventListener('data-refreshed' as any, handleRefresh);
    };
  }, [message, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {notificationMessage}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

