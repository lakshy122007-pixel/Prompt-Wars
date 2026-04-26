/**
 * @module News Page
 * @description Election news hub with latest articles and updates.
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Newspaper,
  ExternalLink,
  Calendar,
  Globe,
  Search,
  RefreshCw,
  TrendingUp,
  Clock,
} from 'lucide-react';
import type { ElectionNewsArticle } from '@/types/election';

const sampleNews: ElectionNewsArticle[] = [
  {
    title: 'Election Commission Announces Schedule for Upcoming State Elections',
    snippet: 'The ECI has announced the schedule for assembly elections in five states, with polling to be held in multiple phases starting next month.',
    url: 'https://eci.gov.in',
    source: 'Election Commission of India',
    publishedDate: '2024-12-15',
  },
  {
    title: 'New Voter Registration Drive Targets Youth in Rural Areas',
    snippet: 'A nationwide campaign aims to register 2 crore new young voters ahead of upcoming elections, focusing on rural and underserved communities.',
    url: 'https://eci.gov.in',
    source: 'PIB India',
    publishedDate: '2024-12-14',
  },
  {
    title: 'Supreme Court Upholds Validity of EVM and VVPAT System',
    snippet: 'The apex court has dismissed petitions questioning the reliability of Electronic Voting Machines, reaffirming faith in the electoral process.',
    url: 'https://eci.gov.in',
    source: 'The Hindu',
    publishedDate: '2024-12-13',
  },
  {
    title: 'ECI Introduces Accessibility Improvements at Polling Stations',
    snippet: 'New guidelines mandate ramp access, Braille-enabled EVMs, and dedicated volunteers for differently-abled voters across all booths.',
    url: 'https://eci.gov.in',
    source: 'NDTV',
    publishedDate: '2024-12-12',
  },
  {
    title: 'Digital Voter ID Cards Now Available Through DigiLocker',
    snippet: 'Citizens can now download their e-EPIC (Electronic Photo Identity Card) through DigiLocker, eliminating the need for physical cards.',
    url: 'https://eci.gov.in',
    source: 'Times of India',
    publishedDate: '2024-12-11',
  },
  {
    title: 'Model Code of Conduct: A Comprehensive Guide for Citizens',
    snippet: 'Understanding the rules that govern political parties and candidates during election season, and how citizens can report violations.',
    url: 'https://eci.gov.in',
    source: 'Indian Express',
    publishedDate: '2024-12-10',
  },
];

export default function NewsPage() {
  const [articles] = useState<ElectionNewsArticle[]>(sampleNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 mb-4">
            <Newspaper className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">News Hub</span>
          </div>
          <h1>
            <span className="gradient-text">Election News & Updates</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Stay informed with the latest election news, ECI announcements, and civic updates.
          </p>
        </div>

        {/* Search & Refresh */}
        <div className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news articles..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search news"
            />
          </div>
          <Button variant="outline" onClick={handleRefresh} isLoading={isRefreshing}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Trending Topics */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Trending:</span>
          {['EVM Security', 'Voter Registration', 'State Elections', 'NOTA'].map((topic) => (
            <button
              key={topic}
              onClick={() => setSearchQuery(topic)}
              className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No articles found matching &quot;{searchQuery}&quot;</p>
              </CardContent>
            </Card>
          ) : (
            filteredArticles.map((article, idx) => (
              <a
                key={idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card hover>
                  <CardContent className="flex gap-4">
                    {/* Thumbnail placeholder */}
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-saffron/20 to-india-green/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Newspaper className="w-8 h-8 text-saffron/60" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {article.snippet}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {article.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.publishedDate)}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))
          )}
        </div>

        {/* Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            News is updated periodically. Configure Google Custom Search API for live news feeds.
          </p>
        </div>
      </div>
    </div>
  );
}
