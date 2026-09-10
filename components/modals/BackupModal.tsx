'use client';

import React, { useState, useRef } from 'react';
import { Place } from '@/types/place';
import { exportPlacesToJson, validateAndSanitizeImport } from '@/lib/export-import';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Download, Upload, Check, AlertCircle, FileText } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  onImportPlaces: (imported: Place[]) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  places,
  onImportPlaces,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  if (!isOpen) return null;

  const handleDownload = () => {
    try {
      const json = exportPlacesToJson(places, 'London');
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tastemap-london-ranking-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFeedback({ type: 'success', message: t('backup.exportedSuccess') });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = validateAndSanitizeImport(content);

      if (result.valid && result.sanitizedPlaces) {
        onImportPlaces(result.sanitizedPlaces);
        setFeedback({
          type: 'success',
          message: t('backup.importedSuccess', { count: result.sanitizedPlaces.length }),
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: result.error || t('backup.validationError') });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#141A17] border border-[#EAEAE5] dark:border-[#222924] rounded-3xl shadow-2xl overflow-hidden text-[#191917] dark:text-[#F0F2EE]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAEAE5] dark:border-[#222924] flex items-center justify-between bg-[#FAFAF8] dark:bg-[#18201B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C4434] text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#141814] dark:text-white">
                {t('backup.title')}
              </h2>
              <p className="text-xs text-[#71716A] dark:text-[#8E968E]">{t('backup.subtitle')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71716A] hover:text-[#141814] hover:bg-[#EAEAE5] dark:hover:bg-[#252E28] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-4 text-sm">
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-[#EFF5F1] text-[#1C4434] border border-[#D2E2D6]'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Exportar */}
          <div className="p-4 rounded-2xl bg-[#F8F8F5] dark:bg-[#1A211D] border border-[#EAEAE5] dark:border-[#252E28] space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#555A54] dark:text-[#A8B2A6]">
              {t('backup.exportSection')}
            </h3>
            <p className="text-xs text-[#71716A] dark:text-[#8E968E]">
              {t('backup.exportDesc')}
            </p>
            <button
              onClick={handleDownload}
              className="mt-2 w-full py-2.5 px-4 rounded-full font-bold text-xs bg-[#1C4434] hover:bg-[#153629] text-white flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('backup.downloadButton')} ({places.length})</span>
            </button>
          </div>

          {/* Importar */}
          <div className="p-4 rounded-2xl bg-[#F8F8F5] dark:bg-[#1A211D] border border-[#EAEAE5] dark:border-[#252E28] space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#555A54] dark:text-[#A8B2A6]">
              {t('backup.importSection')}
            </h3>
            <p className="text-xs text-[#71716A] dark:text-[#8E968E]">
              {t('backup.importDesc')}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full py-2.5 px-4 rounded-full font-bold text-xs bg-white dark:bg-[#252E28] border border-[#D5D5CD] dark:border-[#38463D] hover:bg-[#F2F2EC] text-[#191917] dark:text-[#F0F2EE] flex items-center justify-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-[#1C4434] dark:text-[#45B887]" />
              <span>{t('backup.selectFile')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
