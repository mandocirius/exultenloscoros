"use client";
// Deployment: 2026-02-19
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Song {
  id: string;
  title: string;
  description: string;
  type: 'file' | 'folder';
  name?: string;
  key: string;
}

function HomePageContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<{ files: Song[], folders: Song[] }>({ files: [], folders: [] });
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const urlPrefix = searchParams.get('prefix');

  const fetchItems = async (prefix: string = '') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/songs?prefix=${encodeURIComponent(prefix)}`);
      const data = await response.json();
      setItems({ 
        files: data.files || [], 
        folders: data.folders || [] 
      });
      setCurrentPrefix(prefix);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(urlPrefix || '');
  }, [urlPrefix]);

  const handleFolderClick = (prefix: string) => {
    fetchItems(prefix);
  };

  const handleGoBack = () => {
    const parts = currentPrefix.split('/').filter(Boolean);
    parts.pop();
    const newPrefix = parts.length > 0 ? parts.join('/') + '/' : '';
    fetchItems(newPrefix);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) {
        fetchItems(currentPrefix);
        return;
    }
    
    setLoading(true);
    const response = await fetch(`/api/search?q=${searchTerm}`);
    const data = await response.json();
    setItems({ 
        files: data.results || [], 
        folders: [] 
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Hero Banner Ultra-Compacto y Premium */}
      <div className="relative w-full h-[120px] md:h-[150px] overflow-hidden shadow-sm">
        <img 
          src="/portada.png" 
          alt="Cancionero" 
          className="w-full h-full object-cover object-center scale-110 blur-[1px] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent flex flex-col justify-center px-8 md:px-16">
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic drop-shadow-md">
              Cancionero Católico Litúrgico
            </h1>
            <p className="text-lg md:text-2xl font-serif text-blue-100 italic mt-1 opacity-100 tracking-wide drop-shadow-sm">
              "Canten a Dios un cántico nuevo"
            </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 md:px-8 py-6">
        <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
                <button onClick={() => fetchItems('')} className="hover:text-blue-600 transition-colors">Inicio</button>
                {currentPrefix.split('/').filter(Boolean).map((part, i, arr) => (
                    <span key={i} className="flex items-center gap-2">
                        <span className="text-gray-200">/</span>
                        <button 
                            onClick={() => fetchItems(arr.slice(0, i + 1).join('/') + '/')}
                            className="hover:text-blue-600 transition-colors max-w-[120px] truncate"
                        >
                            {part}
                        </button>
                    </span>
                ))}
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full lg:max-w-md group">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en la biblioteca..."
                className="w-full pl-6 pr-14 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all text-sm font-medium placeholder:text-gray-300"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-blue-100 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {currentPrefix && !searchTerm && (
                <button 
                    onClick={handleGoBack}
                    className="flex items-center gap-2 text-[11px] font-black uppercase tracking-tighter text-blue-600 bg-white px-5 py-2.5 rounded-full border border-blue-100 hover:bg-blue-50 transition-all shadow-sm active:scale-[0.98]"
                >
                    <span className="text-base leading-none">←</span> Directorio Anterior
                </button>
            )}

            {/* Listado de Carpetas Estilizadas */}
            {items.folders.length > 0 && (
                <div>
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-6 flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-gray-200"></span>
                      Directorios ({items.folders.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                        {items.folders.map(folder => (
                            <button 
                                key={folder.id} 
                                onClick={() => handleFolderClick(folder.key)}
                                className="flex flex-col items-center p-6 bg-white border border-gray-100 rounded-3xl hover:border-amber-400/50 transition-all hover:shadow-xl hover:shadow-amber-900/5 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-12 h-12 bg-amber-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-4xl mb-3 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">📂</span>
                                <span className="text-xs font-bold text-gray-700 text-center line-clamp-2 leading-relaxed">{folder.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Listado de Archivos Refinado */}
            <div>
                <h2 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-6 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-gray-200"></span>
                  Documentos ({items.files.length})
                </h2>
                {items.files.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.files.map(song => (
                            <div key={song.id} className="bg-white border border-gray-100 rounded-[2rem] p-1 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group">
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                                          <span className="text-lg group-hover:scale-110 transition-transform">📄</span>
                                        </div>
                                        <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase bg-blue-50/50 px-3 py-1 rounded-full">PDF</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-[1.3] mb-8 group-hover:text-blue-700 transition-colors">{song.title}</h3>
                                    <div className="mt-auto">
                                      <Link 
                                        href={`/viewer/${song.id}${currentPrefix ? `?folder=${encodeURIComponent(currentPrefix)}` : ''}`} 
                                        className="w-full flex justify-center items-center py-3.5 bg-gray-900 text-white text-xs font-bold rounded-2xl hover:bg-blue-600 shadow-lg shadow-gray-200 hover:shadow-blue-200 transition-all duration-300 active:scale-[0.98]"
                                      >
                                          Abrir Canto
                                      </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl opacity-20">📂</span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">Directorio vacío</p>
                    </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">Cargando...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
