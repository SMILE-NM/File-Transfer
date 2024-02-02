import React, { useState, ChangeEvent, useEffect } from "react";
import io from "socket.io-client";
import "./styles/file.css";
const socket = io("http://192.168.0.118:4000");

interface FileData {
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer | string;
}

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  useEffect(() => {
    socket.on("fileUploaded", (fileData: FileData) => {
      // Добавляем новый файл в список загруженных файлов
      setUploadedFiles((prevFiles) => [...prevFiles, fileData]);
    });

    return () => {
      socket.off("fileUploaded");
    };
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const fileData: FileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            data: event.target.result,
          };
          socket.emit("uploadFile", fileData);
        }
      };
    }
  };

  const handleDownload = (fileData: FileData) => {
    // Создаем Blob из ArrayBuffer
    const blob = new Blob([fileData.data], { type: fileData.type });
    // Создаем ссылку на Blob и автоматически скачиваем файл
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      <h2>Uploaded Files:</h2>
      <ul className="list">
        {uploadedFiles.map((fileData, index) => (
          <li key={index} className="item">
            {fileData.name} - {fileData.size} bytes{" "}
            <button onClick={() => handleDownload(fileData)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;
