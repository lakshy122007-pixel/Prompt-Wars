/**
 * @module Footer Component
 * @description App footer with India-themed tricolor border and links.
 */

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card">
      {/* Tricolor accent line */}
      <div className="h-1 w-full" style={{
        background: 'linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)'
      }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-display font-bold gradient-text">ElectionEdu</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-powered election education platform helping Indian citizens understand and participate in democracy.
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">Learn</h4>
            <ul className="space-y-2">
              <li>
                <Link href={ROUTES.LEARN} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Learning Modules
                </Link>
              </li>
              <li>
                <Link href={ROUTES.QUIZ} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Take a Quiz
                </Link>
              </li>
              <li>
                <Link href={ROUTES.NEWS} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Election News
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link href={ROUTES.ASSISTANT} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href={ROUTES.POLLING_STATION} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Find Polling Station
                </Link>
              </li>
              <li>
                <Link href={ROUTES.VOTER_CHECK} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Voter Eligibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Election Commission of India ↗
                </a>
              </li>
              <li>
                <a
                  href="https://voters.eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  National Voters&apos; Service ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ElectionEdu. For educational purposes only. Not affiliated with ECI.
          </p>
          <p className="text-xs text-muted-foreground">
            🇮🇳 Made in India with ❤️ for Democracy
          </p>
        </div>
      </div>
    </footer>
  );
};
