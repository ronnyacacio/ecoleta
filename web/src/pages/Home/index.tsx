import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiSearch, FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import ibge from '../../services/ibge';
import logo from '../../assets/logo.svg';
import './styles.css';

interface Points {
  id: number;
  city: string;
  image: string;
  name: string;
  uf: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const [search, setSearch] = useState(false);

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const history = useHistory();

  useEffect(() => {
    async function loadUfs() {
      const response = await ibge.get<IBGEUFResponse[]>('localidades/estados');

      const ufInitials = response.data.map(uf => uf.sigla);

      setUfs(ufInitials);
    }
    loadUfs();
  }, []);

  useEffect(() => {
    async function loadCities() {
      if (selectedUf === '0') {
        setCities([]);
        return;
      }

      const response = await ibge.get<IBGECityResponse[]>(`localidades/estados/${selectedUf}/municipios`);

      const cityNames = response.data.map(city => city.nome);

      setCities(cityNames);
    }
    loadCities();
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  async function handleToPoints(event: FormEvent) {
    event.preventDefault();

    if (selectedCity === '0' || selectedUf === '0') {
      return;
    }

    const items = [1, 2, 3, 4, 5, 6];

    const response = await api.get<Points[]>('/points', {
      params: {
        uf: selectedUf,
        city: selectedCity,
        items,
      }
    });

    const pointIds = response.data.map(point => point.id);

    history.push('/points', { pointIds, });
  }

  function handleToogleSearch() {
    setSearch(!search);
  }

  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
          <button onClick={handleToogleSearch}>
            <span>
              <FiSearch />
            </span>
            <strong>Procure pontos de coleta</strong>
          </button>
        </header>
        <main>
          <h1>Seu marketplace de coleta de resíduoes.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

          <Link to="/new">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um pontos de coleta</strong>
          </Link>
        </main>
      </div>
      {search && (
        <div className="search">
          <header>
            <FiArrowLeft onClick={handleToogleSearch} />
          </header>
          <main>
            <form onSubmit={handleToPoints}>
              <div className="field-group">
                <div className="field">
                  <select
                    name="uf"
                    id="uf"
                    value={selectedUf}
                    onChange={handleSelectUf}
                  >
                    <option value="0">Selecione uma UF</option>
                    {ufs.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <select
                    name="city"
                    id="city"
                    value={selectedCity}
                    onChange={handleSelectCity}
                  >
                    <option value="0">Selecione uma cidade</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit">
                <span>
                  <FiSearch />
                </span>
                <strong>Buscar</strong>
              </button>
            </form>
          </main>
        </div>
      )}
    </div>
  );
}

export default Home;

