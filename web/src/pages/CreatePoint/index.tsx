import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import * as Yup from 'yup';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

import api from '../../services/api';
import ibge from '../../services/ibge';
import Dropzone from '../../components/Dropzone';
import logo from '../../assets/logo.svg';
import './styles.css';

const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  whatsapp: Yup.string().required(),
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
  city: Yup.string().required(),
  uf: Yup.string().max(2).min(2).required(),
  items: Yup.string().required(),
});

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface InputData {
  name: string;
  email: string;
  whatsapp: string;
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [inputData, setInputData] = useState<InputData>({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const [marker, setMarker] = useState(false);
  const [pointCreated, setPointCreated] = useState(false);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    async function loadItems() {
      const response = await api.get<Item[]>('items');

      setItems(response.data);
    }
    loadItems();
  }, []);

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

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setSelectedPosition([lat, lng]);

    !marker && setMarker(prevValue => !prevValue);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setInputData({ ...inputData, [name]: value });
  }

  function handleSelectItem(id: number) {
    const alreadyItems = selectedItems.findIndex(item => item === id);

    if (alreadyItems >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else
      setSelectedItems([...selectedItems, id]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = inputData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = marker ? selectedPosition : initialPosition;
    const items = selectedItems.join(',');

    const validate = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    };

    if (!(await schema.isValid(validate))) {
      alert('Todos os campos são necessários!');
      return;
    }

    if (!selectedFile) {
      alert('Selecione uma imagem do seu estabelecimento!');
      return;
    }

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('longitude', String(longitude));
    data.append('latitude', String(latitude));
    data.append('items', items);
    data.append('image', selectedFile);

    await api.post('points', data);

    setPointCreated(true);

    setTimeout(() => {
      history.push('/');
    }, 2000);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
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
              <label htmlFor="city">Cidade</label>
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
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítems de coleta</h2>
            <span>Selecione um ou mais ítems abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li
                key={item.id}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
                onClick={() => handleSelectItem(item.id)}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
      {pointCreated && (
        <div id="success-message">
          <FiCheckCircle color="#34CB79" size={32} />
          <h2>Cadastro concluído!</h2>
        </div>
      )}
    </div>
  );
};

export default CreatePoint;