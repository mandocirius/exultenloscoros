// src/components/PdfViewer.tsx
"use client";

import { useState } from 'react';

type PdfViewerProps = {
  pdfUrl: string;
};

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full overflow-hidden bg-gray-50">
      {isLoading && (
        <div className="flex justify-center items-center h-full absolute inset-0 z-10 bg-white bg-opacity-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600 font-medium">Cargando PDF...</p>
        </div>
      )}
      <iframe
        src={`${pdfUrl}#view=Fit&toolbar=1&navpanes=0`}
        className={`w-full h-full border-none shadow-2xl ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        title="Visor de PDF"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
