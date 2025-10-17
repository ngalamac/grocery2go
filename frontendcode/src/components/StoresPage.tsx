import React, { useMemo, useState } from 'react';
import { Container } from './ui';
import { stores, yaoundeAreas } from '../data/stores';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Bike } from 'lucide-react';

const Tabs: React.FC<{ value: string; onChange: (v: string) => void }>= ({ value, onChange }) => {
  const items = [
    { key: 'delivery', label: 'Delivery' },
    { key: 'pickup', label: 'Pickup' },
  ];
  return (
    <div className="flex gap-2">
      {items.map(i => (
        <button
          key={i.key}
          className={`px-4 py-2 rounded-full border text-sm ${value===i.key? 'bg-primary-50 border-primary-200 text-primary-700':'bg-white'}`}
          onClick={() => onChange(i.key)}
        >{i.label}</button>
      ))}
    </div>
  );
};

const StoresPage: React.FC = () => {
  const [tab, setTab] = useState<'delivery'|'pickup'>('delivery');
  const [area, setArea] = useState<string>('All Areas');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return stores
      .filter(s => area==='All Areas' || s.area===area)
      .filter(s => (s.name + ' ' + (s.tags||[]).join(' ')).toLowerCase().includes(query.toLowerCase()));
  }, [area, query]);

  return (
    <Container className="py-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={tab} onChange={(v)=>setTab(v as any)} />
        <select value={area} onChange={e=>setArea(e.target.value)} className="px-3 py-2 border rounded-full text-sm">
          <option>All Areas</option>
          {yaoundeAreas.map(a => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div>
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-full border bg-white"
          placeholder="Search stores, markets, supermarkets"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map(s => (
          <button key={s.id} onClick={()=>navigate(`/store/${s.id}`)} className="text-left bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium">
            <div className="relative">
              <img src={s.image} alt={s.name} className="w-full h-28 sm:h-36 object-cover" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur border text-neutral-800 flex items-center gap-1">
                  <Clock size={14} /> {s.etaRangeMins[0]}-{s.etaRangeMins[1]} min
                </div>
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur border text-neutral-800 flex items-center gap-1">
                  <Bike size={14} /> {s.deliveryFeeCFA} CFA
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="font-semibold line-clamp-1">{s.name}</div>
              <div className="flex items-center gap-1 text-sm text-neutral-600">
                <Star size={14} className="text-yellow-400 fill-yellow-400" /> {s.rating}
                <span className="mx-1">•</span>
                <MapPin size={14} /> {s.area}
              </div>
              {s.tags && (
                <div className="mt-1 text-xs text-neutral-500 line-clamp-1">{s.tags.join(' • ')}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </Container>
  );
};

export default StoresPage;
