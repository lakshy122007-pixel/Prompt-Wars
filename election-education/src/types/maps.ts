/**
 * Google Maps-related type definitions
 */

/** A polling station location */
export interface PollingStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  boothNumber: string;
  constituency: string;
  district: string;
  state: string;
  timings: string;
  isAccessible: boolean;
  accessibilityFeatures: string[];
  distanceKm?: number;
  phoneNumber?: string;
}

/** Map viewport bounds */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/** Geolocation coordinates */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/** Geolocation state */
export interface GeolocationState {
  coordinates: GeoCoordinates | null;
  isLoading: boolean;
  error: string | null;
  isPermissionDenied: boolean;
}

/** Map search result */
export interface MapSearchResult {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

/** Direction info */
export interface DirectionInfo {
  distance: string;
  duration: string;
  mode: 'walking' | 'driving' | 'transit';
}
