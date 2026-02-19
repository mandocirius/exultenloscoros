"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PdfViewer from '@/components/PdfViewer';
import { getSongById } from '@/data/songs';

export default function ViewerPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const songId = params.songId as string;
    
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [songData, setSongData] = useState<{ title: string; description: string } | null>(null);

    useEffect(() => {
        const song = getSongById(songId);
        if (song) {
            setSongData({ title: song.title, description: song.description });
        } else {
            // Try decoding base64 key
            try {
                // Restore standard base64 from URL-safe base64
                let base64 = songId.replace(/-/g, '+').replace(/_/g, '/');
                while (base64.length % 4) base64 += '=';
                
                const decodedKey = atob(base64);
                const parts = decodedKey.split('/');
                const fileName = parts[parts.length - 1].replace(/\.pdf$/i, '');
                
                setSongData({ 
                    title: fileName, 
                    description: `Canto litúrgico: ${fileName}`
                });
            } catch (e) {
                // Not base64 or not a valid S3 song
            }
        }
    }, [songId]);

    useEffect(() => {
        // If auth is done loading and there's no user, redirect to login
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        // If there is a user, and we have a songId, fetch the URL
        if (user && songId) {
            const fetchPdfUrl = async () => {
                try {
                    const idToken = await user.getIdToken();
                    const response = await fetch(`/api/songs/${songId}`, {
                        headers: {
                            'Authorization': `Bearer ${idToken}`,
                        }
                    });

                    if (!response.ok) {
                        throw new Error('No se pudo obtener el PDF.');
                    }
                    const data = await response.json();
                    setPdfUrl(data.url);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchPdfUrl();
        }
    }, [user, authLoading, songId, router]);

    if (authLoading || loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Cargando visor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                <p>Error: {error}</p>
            </div>
        );
    }
    
    if (!songData) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">Canto no encontrado</h1>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-65px)] w-full overflow-hidden bg-gray-100 flex flex-col">
            <div className="flex-grow relative">
                {pdfUrl ? (
                    <div className="absolute inset-0 w-full h-full">
                        <PdfViewer pdfUrl={pdfUrl} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 font-bold animate-pulse">Obteniendo Documento...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
