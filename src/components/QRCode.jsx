import React from 'react';

const QRCode = ({ qrUrl }) => {
  return (
    <div>
      <h2>QR-код</h2>
      <img src={qrUrl} alt="QR Code" />
    </div>
  );
};

export default QRCode;
