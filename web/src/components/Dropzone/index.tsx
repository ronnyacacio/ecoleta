import React, { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [fileUrl, setFileUrl] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const url = URL.createObjectURL(file);

    setFileUrl(url);
    onFileUploaded(file);
  }, [onFileUploaded]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*'
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {fileUrl
        ? <img src={fileUrl} alt="Point" />
        : (
          <p>
            <FiUpload />
            Imagem do estabelecimento
          </p>
        )}

    </div>
  );
};

export default Dropzone;
