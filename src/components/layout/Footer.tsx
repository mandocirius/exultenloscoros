// src/components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
    return (
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-sm font-black uppercase tracking-tighter text-gray-900 mb-1">Cancionero Católico Litúrgico</p>
              <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Un ministerio al servicio de la comunidad.</p>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-6 md:gap-10">
              <Link href="/about" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors">Acerca de</Link>
              <Link href="/community" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors">Comunidad</Link>
              <Link href="/privacy" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors">Privacidad</Link>
              <Link href="/support" className="text-xs font-bold uppercase tracking-widest text-green-600 hover:text-green-700 transition-colors">Apoyar</Link>
            </nav>
          </div>
        </div>
      </footer>
    );
  }
  