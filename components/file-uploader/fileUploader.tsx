'use client';

import { UploadedFilesCard } from './uploaded-files-card';
import { FileUploader } from './file-uploader';
// import { useUploadFile } from './use-upload-file';

export function BasicUploader() {
  // const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
  //   'imageUploader',
  //   { defaultUploadedFiles: [] }
  // );

  return (
    // change this width for uploadFile component
    <div className="max-w-[50%] space-y-6">
      <FileUploader
        maxFiles={4}
        maxSize={4 * 1024 * 1024}
        // progresses={progresses}
        // onUpload={uploadFiles}
        // disabled={isUploading}
      />
      {/* <UploadedFilesCard uploadedFiles={uploadedFiles} /> */}
    </div>
  );
}
