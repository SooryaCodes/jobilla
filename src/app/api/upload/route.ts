import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type. Only PDF and DOCX files are allowed.' 
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File too large. Maximum size is 10MB.' 
        },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    // Return file info
    return NextResponse.json({
      success: true,
      data: {
        fileId: fileName.replace(fileExtension, ''),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadPath: filePath
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Upload failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Optional: GET route to check upload status or retrieve file info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');

  if (!fileId) {
    return NextResponse.json(
      { success: false, error: 'File ID required' },
      { status: 400 }
    );
  }

  try {
    // Check if file exists (you could also check a database here)
    const pdfPath = path.join(UPLOAD_DIR, `${fileId}.pdf`);
    const docxPath = path.join(UPLOAD_DIR, `${fileId}.docx`);
    
    const exists = existsSync(pdfPath) || existsSync(docxPath);
    
    return NextResponse.json({
      success: true,
      exists,
      fileId
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error checking file status' },
      { status: 500 }
    );
  }
}
