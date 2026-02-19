"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function HeaderContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const folderPrefix = searchParams.get('folder');
  const [viewingSongTitle, setViewingSongTitle] = useState<string | null>(null);

  // Detectar si estamos en el visor y extraer el título si es posible
  useEffect(() => {
    if (pathname.startsWith('/viewer/')) {
      const songId = pathname.split('/').pop();
      if (songId) {
        try {
          // Intentamos decodificar el nombre del documento desde el ID base64
          let base64 = songId.replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) base64 += '=';
          const decodedKey = atob(base64);
          const parts = decodedKey.split('/');
          const fileName = parts[parts.length - 1].replace(/\.pdf$/i, '');
          setViewingSongTitle(fileName);
        } catch (e) {
          setViewingSongTitle("Documento");
        }
      }
    } else {
      setViewingSongTitle(null);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Logo e Identidad */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/portada.png" 
              alt="Logo" 
              className="w-10 h-10 object-cover rounded-lg border shadow-sm group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-black text-blue-700 tracking-tighter uppercase italic hidden sm:block">Cancionero</span>
          </Link>

          {/* Nombre del Documento (Solo en visor) */}
          {viewingSongTitle && (
            <div className="flex items-center gap-2 border-l pl-4 ml-2 animate-in fade-in slide-in-from-left-4">
              <span className="text-gray-400 hidden md:inline">📄</span>
              <h2 className="text-sm md:text-base font-bold text-gray-800 line-clamp-1 max-w-[150px] md:max-w-[300px]">
                {viewingSongTitle}
              </h2>
            </div>
          )}
        </div>

        {/* Mensaje de Apoyo Integrado (Solo cuando NO estamos en el visor para ahorrar espacio) */}
        {!viewingSongTitle && (
          <Link 
            href="/support" 
            className="hidden lg:flex flex-grow max-w-md bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl px-4 py-1.5 items-center justify-center gap-3 transition-colors group"
          >
            <span className="text-lg">🙏</span>
            <p className="text-xs text-green-800 text-center leading-tight">
              Apoya con <span className="font-bold text-green-600">$0.50 mensual</span> para llegar a más hermanos.
              <span className="ml-2 font-bold underline group-hover:text-green-900">¡Donar aquí!</span>
            </p>
          </Link>
        )}

        {/* Acciones y Navegación */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Botones de Navegación (Solo en visor) */}
          {viewingSongTitle && (
            <div className="flex items-center gap-2">
              {folderPrefix && (
                <button 
                  onClick={() => router.push(`/?prefix=${encodeURIComponent(folderPrefix)}`)}
                  className="px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 border border-amber-100 whitespace-nowrap"
                >
                  <span>←</span> <span className="hidden sm:inline">Carpeta</span>
                </button>
              )}
              <button 
                onClick={() => router.push('/')}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 border border-blue-100 whitespace-nowrap"
              >
                <span>🏠</span> <span className="hidden sm:inline">Dashboard</span>
              </button>
            </div>
          )}

          <nav className="flex items-center space-x-2 md:space-x-4">
            {!loading && user ? (
              <>
                <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
                <span className="text-xs md:text-sm font-medium text-gray-600 hidden lg:inline-block max-w-[150px] truncate">
                  {user.displayName || user.email}
                </span>
                <button onClick={handleLogout} className="px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all hover:border-gray-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<header className="bg-white shadow-sm border-b sticky top-0 z-50 h-[57px] md:h-[65px]"></header>}>
      <HeaderContent />
    </Suspense>
  );
}
