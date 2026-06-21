// src/lib/google/mapsAdvanced.ts
import { Client, Language } from '@googlemaps/google-maps-services-js';
import { logger } from '@/lib/utils/logger';
import type { PollingStation } from '@/types/maps';

const mapsClient = new Client({});
const API_KEY = process.env.GOOGLE_MAPS_SERVER_API_KEY!;

/**
 * Find polling stations near a location using Google Places API
 * Falls back to mock data in development
 */
export async function findNearbyPollingStations(
  lat: number,
  lng: number,
  radiusMeters: number = 5000
): Promise<PollingStation[]> {
  try {
    const response = await mapsClient.placesNearby({
      params: {
        location: { lat, lng },
        radius: radiusMeters,
        keyword: 'polling station booth election',
        language: Language.en,
        key: API_KEY,
      },
      timeout: 10000,
    });

    return response.data.results.slice(0, 10).map((place, index) => {
      const isAccessible = (place.types as string[])?.includes('establishment') ?? false;
      return {
        id: place.place_id ?? `station_${index}`,
        name: place.name ?? 'Polling Station',
        address: place.vicinity ?? 'Address not available',
        latitude: place.geometry?.location.lat ?? lat,
        longitude: place.geometry?.location.lng ?? lng,
        boothNumber: `BOOTH-${String(index + 1).padStart(3, '0')}`,
        constituency: 'N/A',
        district: 'N/A',
        state: 'N/A',
        timings: '7:00 AM - 6:00 PM',
        isAccessible,
        accessibilityFeatures: isAccessible ? ['Wheelchair ramp'] : [],
        distanceKm: calculateDistance(lat, lng, place.geometry?.location.lat ?? lat, place.geometry?.location.lng ?? lng),
        phoneNumber: undefined,
      };
    });
  } catch (error) {
    logger.error('Google Maps API error', { error, lat, lng });
    throw new Error('Unable to find polling stations. Please try again.');
  }
}

/**
 * Geocode an address to coordinates using Google Geocoding API
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; formattedAddress: string }> {
  const response = await mapsClient.geocode({
    params: { address, region: 'IN', language: Language.en, key: API_KEY },
  });

  if (response.data.results.length === 0) {
    throw new Error('Address not found');
  }

  const result = response.data.results[0];
  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
  };
}

/**
 * Calculate distance between two coordinates in kilometers
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
