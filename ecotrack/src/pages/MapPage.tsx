import React, { useState, useEffect, useRef } from 'react';
import { mapsService, EcoLocation } from '../services/mapsService.js';
import { Search, Navigation, Compass, AlertCircle, List, Map as MapIcon } from 'lucide-react';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const MapPage: React.FC = () => {
  // Geolocation states
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // default to San Francisco
  const [addressInput, setAddressInput] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<'recycling' | 'ev_charging' | 'transit' | 'farmers_market'>('recycling');
  const [locations, setLocations] = useState<EcoLocation[]>([]);
  const [loading, setLoading] = useState(false);

  // Tab View state (satisfies E2E A11y tests)
  const [activeTab, setActiveTab] = useState<'both' | 'list-only'>('both');

  // Map reference
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 1. Explicitly request Geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        () => {
          console.warn('Geolocation permission denied, falling back to manual settings.');
          setLocationError('Location access denied. Please enter an address manually below.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  // 2. Load Google Maps script and trigger fetch (Debounced)
  useEffect(() => {
    let debouncer = setTimeout(() => {
      loadAndQuery();
    }, 400);

    return () => clearTimeout(debouncer);
  }, [center, categoryFilter]);

  const loadAndQuery = async () => {
    setLoading(true);
    try {
      if (GOOGLE_MAPS_KEY) {
        await mapsService.loadGoogleMapsScript(GOOGLE_MAPS_KEY);
      }
    } catch (err) {
      console.warn('Could not load Google Maps script. Loading offline locations.');
    }

    const spots = await mapsService.fetchNearbyEcoLocations(center, categoryFilter);
    setLocations(spots);
    setLoading(false);

    // Render/refresh live map if maps SDK loaded and we are not in list-only tab
    if (activeTab === 'both' && mapRef.current && (window as any).google?.maps) {
      renderLiveMap(spots);
    }
  };

  const renderLiveMap = (spots: EcoLocation[]) => {
    try {
      const google = (window as any).google;
      
      if (!googleMapInstance.current) {
        googleMapInstance.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] }
          ]
        });
      } else {
        googleMapInstance.current.setCenter(center);
      }

      // Clear old markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      // Add new markers
      spots.forEach(spot => {
        const marker = new google.maps.Marker({
          position: { lat: spot.lat, lng: spot.lng },
          map: googleMapInstance.current,
          title: spot.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#10b981', // emerald green
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff'
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="color:#0f172a; font-family:sans-serif; padding:4px;">
            <h3 style="margin:0 0 4px 0; font-weight:bold;">${spot.name}</h3>
            <p style="margin:0; font-size:12px; color:#475569;">${spot.address}</p>
          </div>`
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMapInstance.current, marker);
        });

        markersRef.current.push(marker);
      });
    } catch (err) {
      console.error('Failed to render Google Map:', err);
    }
  };

  // Handle Manual Address search
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;

    // Simple geocoder fallback: if user types Seattle, center there. If SF, center there.
    // Otherwise shift slightly off default center for mock variability.
    const queryLower = addressInput.toLowerCase();
    if (queryLower.includes('seattle')) {
      setCenter({ lat: 47.6062, lng: -122.3321 });
      setLocationError(null);
    } else if (queryLower.includes('san francisco') || queryLower.includes('sf')) {
      setCenter({ lat: 37.7749, lng: -122.4194 });
      setLocationError(null);
    } else if (queryLower.includes('chicago')) {
      setCenter({ lat: 41.8781, lng: -87.6298 });
      setLocationError(null);
    } else {
      // Mock search variation
      setCenter({ lat: center.lat + 0.005, lng: center.lng - 0.005 });
      setLocationError(null);
    }
  };

  return (
    <div className="space-y-8 py-6 animate-fade-in-up">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-extrabold text-foreground" id="map-heading">
          Nearby Eco Locations
        </h1>
        <p className="text-muted-foreground text-sm">
          Find recycling depots, EV charging grids, public transit connections, and local organic markets.
        </p>
      </div>

      {/* Geolocation Fallback & Manual Search */}
      <section className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4" aria-label="Location search">
        {locationError && (
          <div className="flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs rounded-xl p-3" role="alert">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        <form onSubmit={handleAddressSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              id="map-address-search"
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter City or Address (e.g. Seattle, WA)"
              className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus-ring"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/95 px-6 py-3 rounded-xl font-bold transition-all focus-ring text-sm"
            id="map-search-btn"
          >
            Search Area
          </button>
        </form>
      </section>

      {/* Tab controls (satisfies E2E A11y tests) */}
      <div className="flex border-b border-border" role="tablist" aria-label="Map View Options">
        <button
          role="tab"
          aria-selected={activeTab === 'both'}
          onClick={() => setActiveTab('both')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all focus-ring flex items-center space-x-1.5 ${
            activeTab === 'both'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          id="tab-map-both"
        >
          <MapIcon className="h-4 w-4" />
          <span>Map & List</span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'list-only'}
          onClick={() => {
            setActiveTab('list-only');
            googleMapInstance.current = null;
          }}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all focus-ring flex items-center space-x-1.5 ${
            activeTab === 'list-only'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          id="tab-map-list-only"
        >
          <List className="h-4 w-4" />
          <span>List View Only</span>
        </button>
      </div>

      {/* Filter Category Chips */}
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Place Categories">
        {[
          { id: 'recycling', label: 'Recycling Centers' },
          { id: 'ev_charging', label: 'EV Chargers' },
          { id: 'transit', label: 'Transit Stops' },
          { id: 'farmers_market', label: 'Farmers Markets' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setCategoryFilter(btn.id as any)}
            aria-pressed={categoryFilter === btn.id}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all focus-ring ${
              categoryFilter === btn.id
                ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
            id={`map-filter-${btn.id}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Map Container (Hidden if List View only tab is selected) */}
        {activeTab === 'both' && (
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl h-[420px] overflow-hidden shadow-sm relative">
            {!GOOGLE_MAPS_KEY && (
              /* Custom sandbox placeholder visual */
              <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-6 space-y-4 z-10">
                <Compass className="h-12 w-12 text-primary animate-spin" style={{ animationDuration: '6s' }} />
                <h3 className="text-lg font-bold font-heading text-foreground">Local Sandbox Map Mode</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Google Maps SDK API key missing from `.env`. Markers are calculated relative to coordinates: <br />
                  <span className="font-mono text-primary">{center.lat.toFixed(4)}, {center.lng.toFixed(4)}</span>.
                </p>
              </div>
            )}
            <div ref={mapRef} className="w-full h-full"></div>
          </div>
        )}

        {/* List View Details Column */}
        <section 
          className={`${activeTab === 'both' ? 'lg:col-span-4' : 'lg:col-span-12'} space-y-4`}
          aria-label="List of nearby facilities"
        >
          <h2 className="text-lg font-bold font-heading text-foreground">Nearby Facilities</h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : locations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No facilities found near this location.</p>
          ) : (
            <ul className="space-y-3" id="map-locations-list">
              {locations.map((loc) => (
                <li 
                  key={loc.id} 
                  className="bg-card border border-border p-4 rounded-xl flex items-start justify-between shadow-sm focus-ring outline-none"
                  tabIndex={0}
                >
                  <div className="space-y-1 pr-2">
                    <h3 className="text-sm font-bold text-foreground font-heading">{loc.name}</h3>
                    <p className="text-xs text-muted-foreground">{loc.address}</p>
                    <p className="text-[10px] text-primary font-semibold">{loc.distanceKm} km away</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted hover:bg-primary hover:text-primary-foreground p-2 rounded-lg text-muted-foreground transition-all focus-ring"
                    aria-label={`Get directions to ${loc.name}`}
                    title="Get Directions"
                  >
                    <Navigation className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
  );
};

export default MapPage;
