import axios from 'axios';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DocumentUpload = () => {
  const [docuementStatus, setDocumentStatus] = useState(null);

  const onDrop = (acceptedFiles) => {
    const formData = new FormData();
    formData.append('document', acceptedFiles[0]);

    axios
      .post(`${process.env.REACT_APP_API}/api/upload`, formData)
      .then(() => {
        setDocumentStatus(true);
      })
      .catch((error) => {
        setDocumentStatus(false);
        console.error('Error uploading document', error);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} data-testid="input" />
        <div className="border-black border-dashed border-2 rounded-md py-10 bg-slate-100">
          <p className="font-bold text-lg">Drop file here</p>
          <div>
            <span className="text-sm font-grey">or&nbsp;</span>
            <span className="text-md font-bold text-sky-600 underline cursor-pointer">
              Select file
            </span>
          </div>
        </div>
      </div>
      {docuementStatus !== null &&
        (docuementStatus ? (
          <p className="text-right text-sky-600">Document upload succeed</p>
        ) : (
          <p className="text-right text-red-600">Document upload failed</p>
        ))}
    </>
  );
};

export default DocumentUpload;
