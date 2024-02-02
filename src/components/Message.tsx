// App.tsx

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Укажите адрес вашего сервера

function Message(): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("message", (message: string) => {
      setReceivedMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleSend = () => {
    if (message) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Отправка и прием сообщений через Socket.IO</h1>
      <div>
        <input
          type="text"
          placeholder="Введите сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>Отправить</button>
      </div>
      <div>
        <h2>Полученные сообщения:</h2>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Message;
