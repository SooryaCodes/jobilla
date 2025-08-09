import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { parsePDF, parseDOCX } from '@/lib/pdfParser';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function POST(request: NextRequest) {
  let fileId: string | undefined;
  let fileName: string | undefined;
  
  try {
    const requestData = await request.json();
    fileId = requestData.fileId;
    fileName = requestData.fileName;

    if (!fileId || !fileName) {
      return NextResponse.json(
        { success: false, error: 'File ID and file name required' },
        { status: 400 }
      );
    }

    // Determine file extension
    const fileExtension = path.extname(fileName).toLowerCase();
    if (!['.pdf', '.docx'].includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Construct file path
    const filePath = path.join(UPLOAD_DIR, `${fileId}${fileExtension}`);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Read file buffer
    const fileBuffer = await readFile(filePath);

    // Parse file based on extension
    console.log('Parsing file:', fileName, 'Size:', fileBuffer.length);
    
    let parseResult;
    if (fileExtension === '.pdf') {
      parseResult = await parsePDF(fileBuffer);
    } else if (fileExtension === '.docx') {
      parseResult = await parseDOCX(fileBuffer);
    } else {
      return NextResponse.json({
        success: false,
        error: 'Unsupported file type'
      }, { status: 400 });
    }

    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: parseResult.error,
        warnings: [],
        confidence: 0
      }, { status: 400 });
    }

    // Return parsed data
    return NextResponse.json({
      success: true,
      data: parseResult.data,
      warnings: [],
      confidence: 0.7,
      fileInfo: {
        fileId,
        fileName,
        fileSize: fileBuffer.length
      }
    });

  } catch (error) {
    console.error('Parse error details:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fileId,
      fileName
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`
      },
      { status: 500 }
    );
  }
}

// Optional: GET route for checking parse status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');

  if (!fileId) {
    return NextResponse.json(
      { success: false, error: 'File ID required' },
      { status: 400 }
    );
  }

  // This could be enhanced to check parsing status from a database
  // For now, just return a simple status
  return NextResponse.json({
    success: true,
    status: 'ready_for_parsing',
    fileId
  });
}
