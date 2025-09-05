import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import OrderServiceForm from '../components/OrderServiceForm';

const CompanyPublic = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/company/${id}`)
      .then(res => {
        setCompany(res.data);
        setServices(res.data.services || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!company) return <div>Компания не найдена</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">{company.name || 'Без названия'}</h1>
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2">
          {company.photo ? (
            <img src={company.photo} alt="Фото компании" className="w-full h-full object-cover" />
          ) : (
            <span className="flex items-center justify-center h-full text-gray-400">Нет фото</span>
          )}
        </div>
        <div className="text-gray-600">{company.email || 'Нет email'}</div>
        <div className="mt-2 text-sm text-gray-700">
          {company.description ? company.description : <span className="text-gray-400">Нет описания</span>}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Услуги компании</h2>
        {services.length > 0 ? (
          <ul className="list-disc pl-6">
            {services.map((service, idx) => (
              <li key={idx}>{service}</li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-400">Нет услуг</span>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Заказать услугу</h2>
        <OrderServiceForm companyId={company._id} services={services} />
      </div>
    </div>
  );
};

export default CompanyPublic;
