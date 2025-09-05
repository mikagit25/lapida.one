import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const OrderRequests = ({ companyId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/company/orders?companyId=${companyId}`)
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      });
  }, [companyId]);

  if (loading) return <div>Загрузка заявок...</div>;
  if (!orders.length) return <div>Заявок пока нет.</div>;

  return (
    <div className="bg-gray-50 rounded-xl shadow p-4">
      <ul>
        {orders.map((order, idx) => (
          <li key={order._id || idx} className="mb-4 border-b pb-2">
            <div><b>Услуга:</b> {order.service}</div>
            <div><b>Имя:</b> {order.name}</div>
            <div><b>Телефон:</b> {order.phone}</div>
            {order.comment && <div><b>Комментарий:</b> {order.comment}</div>}
            <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderRequests;
