'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Service Worker foi atualizado
        setShowUpdate(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-blue-600 text-white rounded-lg shadow-lg p-4 animate-in slide-in-from-top-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">
              Nova versão disponível
            </h3>
            <p className="text-sm text-blue-100">
              Clique para atualizar o aplicativo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Atualizar
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 text-blue-200 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
