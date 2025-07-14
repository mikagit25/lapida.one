// src/hooks/useToast.js
import { useState } from "react";

export const useToast = () => {
  const [message, setMessage] = useState(null);

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000); // Скрыть сообщение через 3 секунды
  };

  return {
    message,
    showToast,
  };
};
