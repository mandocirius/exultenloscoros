// src/components/PdfViewer.tsx
"use client";

import { useState } from 'react';

type PdfViewerProps = {
  pdfUrl: string;
};

  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  return (
    <div className="w-full h-full overflow-hidden bg-gray-50 relative">
      {isLoading && (
        <div className="flex justify-center items-center h-full absolute inset-0 z-10 bg-white">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-sm text-gray-500 font-medium">Abriendo Documento...</p>
        </div>
      )}
      
      {/* Intentar cargar el PDF directamente, pero usar Google Viewer en móviles o navegadores sin soporte nativo */}
      <iframe
        src={`${pdfUrl}#view=Fit&toolbar=1&navpanes=0`}
        className={`hidden md:block w-full h-full border-none shadow-2xl ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        title="Visor de PDF Escritorio"
        onLoad={() => setIsLoading(false)}
      />

      {/* Visor específico para móviles para evitar el botón "Open" */}
      <iframe
        src={googleViewerUrl}
        className={`md:hidden w-full h-full border-none ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        title="Visor de PDF Móvil"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
