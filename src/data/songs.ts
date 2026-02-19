// src/data/songs.ts
interface Song {
    id: string;
    title: string;
    description: string;
    s3Key: string;
}

export const songs: Song[] = [
    {
        id: 'pescador-de-hombres',
        title: 'Pescador de Hombres',
        description: 'Tú has venido a la orilla, no has buscado ni a sabios ni a ricos...',
        s3Key: 'SEGMENTADO/A-001-PESCADOR DE HOMBRES.pdf',
    },
    {
        id: 'tan-cerca-de-mi',
        title: 'Tan Cerca de Mí',
        description: 'Tan cerca de mí, que hasta lo puedo tocar, Jesús está aquí...',
        s3Key: 'SEGMENTADO/A-002-TAN CERCA DE MÍ.pdf',
    }
];

export const getSongById = (id: string): Song | undefined => {
    return songs.find(song => song.id === id);
}
