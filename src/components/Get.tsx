import React, { useState, useEffect } from "react";
import "./styles/get.css";
import io from "socket.io-client";

function Get(): JSX.Element {
  const [files, setFiles] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("No connect");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Генерация уникального идентификатора пользователя
    const userId = generateUserId();
    setUserId(userId);

    const socket = io("http://localhost:3001"); // Адрес вашего сервера Socket.io

    // Обработчик события подтверждения установки соединения
    socket.on("connect", () => {
      setStatus("Connected. Waiting for files...");
    });

    // Обработчик события получения списка файлов
    socket.on("fileList", (fileList: string[]) => {
      setFiles(fileList);
      setStatus("Files available");
    });

    return () => {
      socket.disconnect(); // Отключение от сервера при размонтировании компонента
    };
  }, []);

  const handleDownload = (fileName: string) => {
    // Можно добавить логику для скачивания файла
  };

  // Функция для генерации уникального идентификатора пользователя
  const generateUserId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="get-main">
      <h1>Get</h1>
      <div className="connect">
        <p className="connect-id">ID: {userId}</p>
        <p>Status: {status}</p>
        <hr />
        <h2>List file</h2>
        <div className="send-files">
          {files.map((fileName, index) => (
            <button
              key={index}
              onClick={() => handleDownload(fileName)}
              className="file"
            >
              {fileName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Get;
