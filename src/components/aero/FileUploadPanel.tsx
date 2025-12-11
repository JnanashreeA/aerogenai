import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import type { ComponentType } from '@/types/aero';

interface FileUploadPanelProps {
  selectedType: ComponentType;
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
  uploadedFileName?: string;
}

export function FileUploadPanel({
  selectedType,
  onFileUpload,
  isUploading = false,
  uploadedFileName,
}: FileUploadPanelProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload Actual Shape</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border bg-muted/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".dat,.txt,.csv,.npy,.mat"
            onChange={handleChange}
            disabled={isUploading}
          />

          <div className="flex flex-col items-center justify-center gap-3 text-center">
            {uploadedFileName ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    File Uploaded
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 break-all">
                    {uploadedFileName}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Drop file here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: .dat, .txt, .csv, .npy, .mat
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={handleButtonClick}
          disabled={isUploading}
          variant="outline"
          className="w-full bg-[#d61f69e6] bg-none"
        >
          <FileText className="w-4 h-4 mr-2" />
          {isUploading ? 'Processing...' : 'Select File'}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">File Format Guidelines:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>.dat/.txt: Space-separated coordinates (x y [z])</li>
            <li>.csv: Comma-separated values</li>
            <li>.npy: NumPy array format</li>
            <li>.mat: MATLAB data format</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
