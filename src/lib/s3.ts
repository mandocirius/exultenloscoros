// src/lib/s3.ts
import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Lists objects and folders (prefixes) in the specified S3 bucket path.
 * @param prefix The current folder path (e.g., 'SEGMENTADO/')
 */
export async function listS3PdfObjects(prefix: string = ''): Promise<{ 
  files: { key: string; name: string }[], 
  folders: { key: string; name: string }[] 
}> {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Prefix: prefix,
    Delimiter: '/', // This is key to grouping objects into folders
  });

  try {
    const response = await s3Client.send(command);
    
    // Extract Folders (CommonPrefixes)
    const folders = (response.CommonPrefixes || []).map(p => {
      const key = p.Prefix!;
      const name = key.split('/').filter(Boolean).pop() || key;
      return { key, name };
    });

    // Extract PDF Files (Contents)
    const files = (response.Contents || [])
      .filter(item => item.Key?.toLowerCase().endsWith('.pdf') && item.Key !== prefix)
      .map(item => {
        const key = item.Key!;
        const fileName = key.split('/').pop()?.replace(/\.pdf$/i, '') || key;
        return { key, name: fileName };
      });

    return { files, folders };
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    return { files: [], folders: [] };
  }
}

/**
 * Generates a pre-signed URL for a specific S3 object.
 * @param key The S3 object key (e.g., 'SEGMENTADO/nombre-canto.pdf')
 * @returns A promise that resolves to the pre-signed URL string.
 */
export async function getPdfSignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  });

  // The URL will be valid for 15 minutes.
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

  return signedUrl;
}
