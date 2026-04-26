/**
 * @module Polling Station Finder Page
 * @description Find nearest polling stations with search functionality.
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  Clock,
  Accessibility,
  MapIcon,
  LocateFixed,
  ExternalLink,
} from 'lucide-react';
import type { PollingStation } from '@/types/maps';

const sampleStations: PollingStation[] = [
  {
    id: '1',
    name: 'Government Primary School, Sector 15',
    address: 'Sector 15, Block C, New Delhi - 110075',
    latitude: 28.5836,
    longitude: 77.3202,
    boothNumber: 'PS-142',
    constituency: 'New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Ramp access', 'Wheelchair available', 'Braille signage'],
    distanceKm: 0.8,
    phoneNumber: '+91 11-2301-XXXX',
  },
  {
    id: '2',
    name: 'Community Hall, Lajpat Nagar',
    address: 'Ring Road, Lajpat Nagar II, New Delhi - 110024',
    latitude: 28.5695,
    longitude: 77.2431,
    boothNumber: 'PS-287',
    constituency: 'South Delhi',
    district: 'South Delhi',
    state: 'Delhi',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: true,
    accessibilityFeatures: ['Ramp access', 'Elderly priority queue'],
    distanceKm: 2.1,
    phoneNumber: '+91 11-2634-XXXX',
  },
  {
    id: '3',
    name: 'MCD School, Karol Bagh',
    address: 'Pusa Road, Karol Bagh, New Delhi - 110005',
    latitude: 28.6517,
    longitude: 77.1903,
    boothNumber: 'PS-56',
    constituency: 'Chandni Chowk',
    district: 'Central Delhi',
    state: 'Delhi',
    timings: '7:00 AM - 6:00 PM',
    isAccessible: false,
    accessibilityFeatures: [],
    distanceKm: 5.3,
  },
];

export default function PollingStationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stations, setStations] = useState<PollingStation[]>(sampleStations);
  const [selectedStation, setSelectedStation] = useState<PollingStation | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = sampleStations.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.constituency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.boothNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setStations(filtered);
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    // Simulate geolocation
    setTimeout(() => {
      setStations(sampleStations);
      setIsLocating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 mb-4">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Polling Station Finder</span>
          </div>
          <h1>
            <span className="gradient-text">Find Your Polling Station</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Locate your nearest polling booth with accessibility information and directions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by area, booth number, or constituency..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Search polling stations"
              />
            </div>
            <Button type="submit" variant="primary">
              <Search className="w-4 h-4" />
              Search
            </Button>
            <Button type="button" variant="outline" onClick={handleLocateMe} isLoading={isLocating}>
              <LocateFixed className="w-4 h-4" />
              <span className="hidden sm:inline">Near Me</span>
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Station List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{stations.length} stations found</span>
              <span className="flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                Sorted by distance
              </span>
            </div>

            {stations.map((station) => (
              <Card
                key={station.id}
                hover
                className={`cursor-pointer ${selectedStation?.id === station.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedStation(station)}
              >
                <CardContent className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base font-semibold">{station.name}</h3>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-mono">
                        {station.boothNumber}
                      </span>
                      {station.isAccessible && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Accessibility className="w-3 h-3" />
                          Accessible
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{station.address}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {station.timings}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapIcon className="w-3 h-3" />
                        {station.constituency}
                      </span>
                      {station.distanceKm && (
                        <span className="flex items-center gap-1 font-medium text-primary">
                          <Navigation className="w-3 h-3" />
                          {station.distanceKm} km
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Station Detail */}
          <div className="lg:col-span-1">
            {selectedStation ? (
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedStation.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Map placeholder */}
                  <div className="h-48 rounded-xl bg-muted flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Google Maps integration</p>
                      <p className="text-xs">Configure GOOGLE_MAPS_API_KEY</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{selectedStation.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedStation.timings}</span>
                    </div>
                    {selectedStation.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedStation.phoneNumber}</span>
                      </div>
                    )}
                  </div>

                  {selectedStation.accessibilityFeatures.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Accessibility className="w-4 h-4" />
                        Accessibility Features
                      </p>
                      <ul className="space-y-1">
                        {selectedStation.accessibilityFeatures.map((f) => (
                          <li key={f} className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStation.latitude},${selectedStation.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="primary" className="w-full" size="sm">
                        <Navigation className="w-4 h-4" />
                        Directions
                      </Button>
                    </a>
                    <a
                      href={`https://www.google.com/maps/@${selectedStation.latitude},${selectedStation.longitude},17z`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-20">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Select a station to see details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
