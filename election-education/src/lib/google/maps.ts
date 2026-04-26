/**
 * @module Google Maps Helpers
 * @description Utilities for Google Maps integration, polling station data,
 * and custom India-themed map styling.
 */

import type { PollingStation } from '@/types/maps';

/** Custom map style in India's national colors */
export const INDIA_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#333366' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#FF9933' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#FF9933' }, { weight: 2 }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#138808' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#e8f5e6' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#ddd' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#FFE5CC' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c8d7e6' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#000080' }],
  },
];

/** Dark mode map style */
export const INDIA_MAP_STYLE_DARK: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0A0A1A' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0A0A1A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8888cc' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#CC7A00' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1A1A35' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#111128' }],
  },
];

/**
 * Sample polling station data for demonstration
 * In production, this would come from ECI's API
 */
export const SAMPLE_POLLING_STATIONS: PollingStation[] = [
  {
    id: 'ps-001',
    name: 'Government Senior Secondary School',
    address: 'Sector 15, Chandigarh, 160015',
    latitude: 30.7515,
    longitude: 76.7844,
    boothNumber: 'B-101',
    constituency: 'Chandigarh',
    district: 'Chandigarh',
    state: 'Chandigarh',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Wheelchair ramp', 'Braille ballot', 'Priority queue'],
    phoneNumber: '+91-172-2700001',
  },
  {
    id: 'ps-002',
    name: 'Delhi Public School Auditorium',
    address: 'Mathura Road, New Delhi, 110003',
    latitude: 28.5921,
    longitude: 77.2507,
    boothNumber: 'B-245',
    constituency: 'New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Wheelchair ramp', 'Sign language interpreter'],
    phoneNumber: '+91-11-23456789',
  },
  {
    id: 'ps-003',
    name: 'Municipal Corporation Community Hall',
    address: 'MG Road, Bangalore, 560001',
    latitude: 12.9716,
    longitude: 77.5946,
    boothNumber: 'B-078',
    constituency: 'Bangalore South',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Wheelchair ramp', 'Braille ballot', 'Assistance available'],
    phoneNumber: '+91-80-22221234',
  },
  {
    id: 'ps-004',
    name: 'Shri Ram Vidya Mandir',
    address: 'Andheri West, Mumbai, 400058',
    latitude: 19.1367,
    longitude: 72.8296,
    boothNumber: 'B-312',
    constituency: 'Mumbai North',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: false,
    accessibilityFeatures: [],
    phoneNumber: '+91-22-26301234',
  },
  {
    id: 'ps-005',
    name: 'Kendriya Vidyalaya Hall',
    address: 'Salt Lake, Kolkata, 700091',
    latitude: 22.5803,
    longitude: 88.4138,
    boothNumber: 'B-189',
    constituency: 'Kolkata North',
    district: 'North 24 Parganas',
    state: 'West Bengal',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Wheelchair ramp', 'Braille ballot'],
    phoneNumber: '+91-33-23001234',
  },
  {
    id: 'ps-006',
    name: 'Rajkiya Ucch Madhyamik Vidyalaya',
    address: 'Vaishali Nagar, Jaipur, 302021',
    latitude: 26.9116,
    longitude: 75.7415,
    boothNumber: 'B-067',
    constituency: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Wheelchair ramp'],
    phoneNumber: '+91-141-2700001',
  },
  {
    id: 'ps-007',
    name: 'Jawaharlal Nehru Stadium Annex',
    address: 'Ashram Road, Ahmedabad, 380009',
    latitude: 23.0225,
    longitude: 72.5714,
    boothNumber: 'B-154',
    constituency: 'Ahmedabad East',
    district: 'Ahmedabad',
    state: 'Gujarat',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Wheelchair ramp', 'Sign language interpreter', 'Braille ballot'],
    phoneNumber: '+91-79-26301234',
  },
  {
    id: 'ps-008',
    name: 'Government Model School',
    address: 'T. Nagar, Chennai, 600017',
    latitude: 13.0418,
    longitude: 80.2341,
    boothNumber: 'B-221',
    constituency: 'Chennai Central',
    district: 'Chennai',
    state: 'Tamil Nadu',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Wheelchair ramp', 'Priority queue'],
    phoneNumber: '+91-44-24341234',
  },
  {
    id: 'ps-009',
    name: 'Saraswati Vidya Niketan',
    address: 'Gomti Nagar, Lucknow, 226010',
    latitude: 26.8467,
    longitude: 80.9462,
    boothNumber: 'B-433',
    constituency: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: false,
    accessibilityFeatures: [],
    phoneNumber: '+91-522-2301234',
  },
  {
    id: 'ps-010',
    name: 'Tagore International School',
    address: 'Banjara Hills, Hyderabad, 500034',
    latitude: 17.4156,
    longitude: 78.4347,
    boothNumber: 'B-098',
    constituency: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Wheelchair ramp', 'Braille ballot', 'Assistance available'],
    phoneNumber: '+91-40-23401234',
  },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lon1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lon2 - Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const EARTH_RADIUS_KM = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 100) / 100;
};

/**
 * Convert degrees to radians
 * @param degrees - Value in degrees
 * @returns Value in radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Find nearest polling stations from a given location
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @param maxResults - Maximum stations to return
 * @returns Sorted array of nearby polling stations with distance
 */
export const findNearestStations = (
  latitude: number,
  longitude: number,
  maxResults: number = 10
): PollingStation[] => {
  return SAMPLE_POLLING_STATIONS
    .map((station) => ({
      ...station,
      distanceKm: calculateDistance(latitude, longitude, station.latitude, station.longitude),
    }))
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    .slice(0, maxResults);
};

/**
 * Generate Google Maps directions URL
 * @param destLat - Destination latitude
 * @param destLng - Destination longitude
 * @param destName - Destination name for display
 * @returns Google Maps directions URL
 */
export const getDirectionsUrl = (
  destLat: number,
  destLng: number,
  destName: string
): string => {
  const encodedName = encodeURIComponent(destName);
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&destination_place_id=${encodedName}&travelmode=driving`;
};
