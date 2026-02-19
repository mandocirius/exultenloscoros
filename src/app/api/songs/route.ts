import { NextResponse } from 'next/server';
import { listS3PdfObjects } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get('prefix') || '';

  try {
    const { files, folders } = await listS3PdfObjects(prefix);
    
    return NextResponse.json({
      folders: folders.map(f => ({
        id: Buffer.from(f.key).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
        name: f.name,
        key: f.key,
        type: 'folder'
      })),
      files: files.map(f => ({
        id: Buffer.from(f.key).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
        title: f.name,
        description: `Canto: ${f.name}`,
        key: f.key,
        type: 'file'
      }))
    });
  } catch (error) {
    console.error("Error fetching songs from S3:", error);
    return NextResponse.json({ error: "No se pudieron listar los contenidos" }, { status: 500 });
  }
}
