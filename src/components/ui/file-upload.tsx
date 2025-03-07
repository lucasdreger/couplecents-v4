import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFileRemoved?: (file: File) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  files?: File[];
  showPreview?: boolean;
}

export function FileUpload({
  onFilesSelected,
  onFileRemoved,
  accept,
  maxFiles = 1,
  maxSize,
  disabled = false,
  className,
  files = [],
  showPreview = true,
}: FileUploadProps) {
  const [preview, setPreview] = React.useState<string[]>([]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled,
  });

  React.useEffect(() => {
    if (!showPreview) return;

    const objectUrls = files.map((file) => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });

    setPreview(objectUrls);

    return () => {
      objectUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [files, showPreview]);

  const removeFile = (index: number) => {
    const file = files[index];
    if (onFileRemoved) {
      onFileRemoved(file);
    }
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-lg border-2 border-dashed border-muted p-4 text-center hover:bg-muted/50',
          isDragActive && 'border-primary bg-muted/50',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          {isDragActive ? (
            <p>Drop the files here</p>
          ) : (
            <p>
              Drag & drop files here, or click to select files
              {maxFiles > 1 && ` (max ${maxFiles})`}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {accept
              ? Object.entries(accept)
                  .map(([key, values]) => values.join(', '))
                  .join(', ')
              : 'Any file type'}
            {maxSize && ` up to ${formatBytes(maxSize)}`}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center gap-2">
                {showPreview && file.type.startsWith('image/') ? (
                  <div className="h-10 w-10 overflow-hidden rounded">
                    <img
                      src={preview[index]}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="h-5 w-5" />
                    ) : (
                      <FileIcon className="h-5 w-5" />
                    )}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}