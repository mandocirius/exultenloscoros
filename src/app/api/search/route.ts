import { NextResponse } from 'next/server';
import { listS3PdfObjects } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    const { files } = await listS3PdfObjects(''); // We search in the root for simplicity or we could search all recursively
    const songsList = files.map(file => ({
      id: Buffer.from(file.key).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
      title: file.name,
      description: `Canto litúrgico: ${file.name}`,
      key: file.key,
      type: 'file'
    }));

    if (!query) {
      return NextResponse.json({ results: songsList });
    }

    const lowercasedQuery = query.toLowerCase();
    const results = songsList.filter(song =>
      song.title.toLowerCase().includes(lowercasedQuery) ||
      song.description.toLowerCase().includes(lowercasedQuery)
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [] });
  }
}
