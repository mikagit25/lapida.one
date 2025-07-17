import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QRCode from '../components/QRCode';

const MemorialDetail = () => {
  const { slug } = useParams();
  const [deceased, setDeceased] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/deceased/${slug}`)
      .then((response) => {
        setDeceased(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    axios
      .get(`/api/deceased/${slug}/qr`)
      .then((response) => {
        setQrUrl(response.data.qr);
      })
      .catch((error) => {
        console.error('Error fetching QR code:', error);
      });
  }, [slug]);

  if (!deceased) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>
        {deceased.firstName} {deceased.lastName}
      </h1>
      <p>{deceased.epitaph}</p>
      <QRCode qrUrl={qrUrl} />
    </div>
  );
};

export default MemorialDetail;
