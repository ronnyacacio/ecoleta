import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import logo from '../../assets/logo.svg';
import './styles.css';

interface Point {
  id: number;
  name: string;
  image_url: string;
  uf: string;
  city: string;
}

interface Data {
  point: Point;
  items: {
    title: string;
  }[];
}

interface Props {
  location: {
    state: {
      pointIds: number[];
    };
  };
}

const Points: React.FC<Props> = ({ location }) => {
  const [data, setData] = useState<Data[]>([]);
  const { pointIds } = location.state;

  useEffect(() => {
    function loadData() {
      pointIds.map(async (point_id) => {
        const response = await api.get<Data>(`points/${point_id}`);

        setData(prevData => [...prevData, response.data]);
      });
    }
    loadData();
  }, [pointIds]);

  return (
    <div id="page-search-points">
      <header>
        <div id="header">
          <img src={logo} alt="Ecoleta-logo" />
          <Link to='/'>
            <FiArrowLeft />
            Voltar para home
          </Link>
        </div>
        <div id="points">
          <strong>{pointIds.length} pontos</strong>
          <span> encontrados</span>
        </div>
      </header>

      <div id="search-background">
        <div id="search-content">
          {data.map(({ point, items }) => (
            <div key={point.id} id="point">
              <img src={point.image_url} alt={point.name} />
              <h1>{point.name}</h1>
              <strong>{items.map(item => (
                `${item.title}, `
              ))}</strong>
              <span>{point.city}, {point.uf}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Points;