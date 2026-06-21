export interface EcoLocation {
  id: string;
  name: string;
  address: string;
  category: 'recycling' | 'ev_charging' | 'transit' | 'farmers_market';
  lat: number;
  lng: number;
  distanceKm: number;
}

let mapsScriptLoaded = false;
let mapsScriptPromise: Promise<void> | null = null;

export const mapsService = {
  loadGoogleMapsScript: (apiKey: string): Promise<void> => {
    if (mapsScriptLoaded) return Promise.resolve();
    if (mapsScriptPromise) return mapsScriptPromise;

    if (!apiKey) {
      console.warn('Google Maps API Key missing. EcoTrack Map will run in local Sandbox mode.');
      return Promise.reject(new Error('API key missing'));
    }

    mapsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        mapsScriptLoaded = true;
        resolve();
      };
      script.onerror = (err) => {
        reject(err);
      };
      document.head.appendChild(script);
    });

    return mapsScriptPromise;
  },

  fetchNearbyEcoLocations: async (
    center: { lat: number; lng: number },
    category: 'recycling' | 'ev_charging' | 'transit' | 'farmers_market'
  ): Promise<EcoLocation[]> => {
    // If live API script is loaded, we can use the PlacesService
    const hasGoogleMaps = typeof window !== 'undefined' && (window as any).google?.maps;

    if (hasGoogleMaps) {
      return new Promise((resolve) => {
        try {
          const mapDiv = document.createElement('div');
          const map = new (window as any).google.maps.Map(mapDiv, { center, zoom: 12 });
          const service = new (window as any).google.maps.places.PlacesService(map);
          
          let keyword = 'recycling';
          if (category === 'ev_charging') keyword = 'EV charging station';
          if (category === 'transit') keyword = 'transit station metro bus';
          if (category === 'farmers_market') keyword = 'farmers market';

          const request = {
            location: center,
            radius: 5000, // 5km
            keyword
          };

          service.nearbySearch(request, (results: any[], status: any) => {
            if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results) {
              const locations: EcoLocation[] = results.map((place, idx) => {
                const placeLat = place.geometry.location.lat();
                const placeLng = place.geometry.location.lng();
                
                // Calculate distance
                const dist = mapsService.calculateHaversineDistance(
                  center.lat,
                  center.lng,
                  placeLat,
                  placeLng
                );

                return {
                  id: place.place_id || `loc_${idx}`,
                  name: place.name || 'Eco Spot',
                  address: place.vicinity || 'Nearby location',
                  category,
                  lat: placeLat,
                  lng: placeLng,
                  distanceKm: Number(dist.toFixed(1))
                };
              });
              resolve(locations);
            } else {
              // Fallback if places API returns no results or fails
              resolve(mapsService.getMockEcoLocations(center, category));
            }
          });
        } catch (err) {
          resolve(mapsService.getMockEcoLocations(center, category));
        }
      });
    } else {
      // Offline/Sandbox Mode Fallback
      return Promise.resolve(mapsService.getMockEcoLocations(center, category));
    }
  },

  calculateHaversineDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  getMockEcoLocations: (
    center: { lat: number; lng: number },
    category: 'recycling' | 'ev_charging' | 'transit' | 'farmers_market'
  ): EcoLocation[] => {
    // Generate realistic relative mock locations based on center
    const mockData: Record<string, { name: string; offsetLat: number; offsetLng: number; address: string }[]> = {
      recycling: [
        { name: 'GreenLife Recycling Center', offsetLat: 0.012, offsetLng: -0.008, address: '124 Maple Ave' },
        { name: 'EcoCycle Waste Depot', offsetLat: -0.009, offsetLng: 0.015, address: '852 Pine St' },
        { name: 'Metro E-Waste Recycling', offsetLat: 0.022, offsetLng: 0.024, address: '401 Industrial Way' }
      ],
      ev_charging: [
        { name: 'ChargePoint EV Charging Station', offsetLat: 0.004, offsetLng: 0.006, address: '302 Broadway' },
        { name: 'Tesla Supercharger Hub', offsetLat: -0.018, offsetLng: -0.011, address: '789 Central Plaza' },
        { name: 'Electrify America Charging', offsetLat: 0.015, offsetLng: -0.022, address: '55 University Ave' }
      ],
      transit: [
        { name: 'Union Square Transit Metro Station', offsetLat: -0.003, offsetLng: -0.002, address: 'Union Ave & 4th St' },
        { name: 'RapidBus Express Bus Stop', offsetLat: 0.009, offsetLng: 0.011, address: '12 Martin Luther Blvd' },
        { name: 'Central Link Light Rail Hub', offsetLat: 0.028, offsetLng: -0.015, address: '900 Link Boulevard' }
      ],
      farmers_market: [
        { name: 'Community Organic Farmers Market', offsetLat: -0.006, offsetLng: -0.014, address: 'Central Park Green' },
        { name: 'Midweek Harvest Market', offsetLat: 0.017, offsetLng: 0.019, address: '228 Civic Plaza' },
        { name: 'Downtown Farmers Exchange', offsetLat: -0.015, offsetLng: 0.005, address: '110 Market St' }
      ]
    };

    const spots = mockData[category] || [];
    return spots.map((spot, index) => {
      const spotLat = center.lat + spot.offsetLat;
      const spotLng = center.lng + spot.offsetLng;
      const dist = mapsService.calculateHaversineDistance(center.lat, center.lng, spotLat, spotLng);
      return {
        id: `mock_${category}_${index}`,
        name: spot.name,
        address: spot.address,
        category,
        lat: spotLat,
        lng: spotLng,
        distanceKm: Number(dist.toFixed(1))
      };
    });
  }
};
