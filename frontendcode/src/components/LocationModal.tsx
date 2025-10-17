import React, { useState } from 'react';
import Modal from './ui/Modal';
import { useLocationCtx } from '../context/LocationContext';

const cities: { city: string; areas: string[] }[] = [
  { city: 'Yaoundé', areas: ['Center', 'Biyem-Assi', 'Bastos', 'Mimboman', 'Nkolbisson'] },
  { city: 'Douala', areas: ['Akwa', 'Bonapriso', 'Bonamoussadi', 'Deido', 'Makepe'] },
];

interface Props { isOpen: boolean; onClose: () => void; }

const LocationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { location, setLocation } = useLocationCtx();
  const [city, setCity] = useState(location.city);
  const [area, setArea] = useState(location.area || '');

  const selected = cities.find(c => c.city === city) || cities[0];

  const save = () => {
    setLocation({ city, area });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose delivery location" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <select value={city} onChange={e => setCity(e.target.value)} className="input">
            {cities.map(c => (<option key={c.city} value={c.city}>{c.city}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Area</label>
          <select value={area} onChange={e => setArea(e.target.value)} className="input">
            {selected.areas.map(a => (<option key={a} value={a}>{a}</option>))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={save} className="btn btn-primary">Save</button>
        </div>
      </div>
    </Modal>
  );
};

export default LocationModal;
