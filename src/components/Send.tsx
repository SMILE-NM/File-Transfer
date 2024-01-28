import React, { useState, ChangeEvent } from "react";
import "./styles/send.css";
import io from "socket.io-client";

function Send(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("No connect");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleConnect = () => {
    if (!file) {
      setStatus("No file selected");
      return;
    }

    const socket = io("http://localhost:3001"); // Адрес вашего сервера Socket.io

    // Отправка файла по сокету
    socket.emit("file", file);

    // Обработчик события подтверждения отправки файла
    socket.on("fileSent", () => {
      setStatus("File sent successfully");
    });
  };

  return (
    <div className="send-main">
      <h1>Send</h1>
      <div className="connect">
        <label htmlFor="connect">
          ID: <input type="text" id="connect" className="connect-input" />
          <button onClick={handleConnect}>Connect</button>
          <p className="status">Status: {status}</p>
        </label>
      </div>

      <input type="file" className="file-upload" onChange={handleFileChange} />
    </div>
  );
}

export default Send;
