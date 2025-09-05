import React, { useState } from 'react';

const QRCode = ({ qrUrl }) => {
  const [copied, setCopied] = useState(false);
  const url = qrUrl || 'https://lapida.one/person/demo-id';

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl shadow">
      <div className="bg-white p-2 rounded">
        {/* SVG-заглушка QR-кода */}
        <svg className="w-24 h-24 text-gray-400" viewBox="0 0 120 120" fill="none">
          <rect x="10" y="10" width="100" height="100" rx="12" fill="#f3f4f6" />
          <rect x="25" y="25" width="20" height="20" rx="4" fill="#d1d5db" />
          <rect x="75" y="25" width="20" height="20" rx="4" fill="#d1d5db" />
          <rect x="25" y="75" width="20" height="20" rx="4" fill="#d1d5db" />
          <rect x="75" y="75" width="20" height="20" rx="4" fill="#d1d5db" />
        </svg>
      </div>
      <div className="text-xs text-gray-500 mb-2">QR-код для перехода на страницу</div>
      <div className="flex gap-2 items-center">
        <span className="text-xs text-blue-600 underline cursor-pointer" onClick={handleCopy}>{url}</span>
        {copied && <span className="text-green-500 text-xs">Скопировано!</span>}
      </div>
    </div>
  );
};

export default QRCode;
