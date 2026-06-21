import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Leaf, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 px-4">
      <div className="text-center space-y-8 max-w-md animate-fade-in-up">
        <div className="relative">
          <div className="text-[120px] font-heading font-extrabold text-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Leaf className="h-10 w-10 animate-bounce" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This path doesn't exist in our carbon-tracking universe. Let's get you back to a greener route.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={user ? '/dashboard' : '/'}
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/95 px-6 py-3 rounded-xl font-bold transition-all focus-ring shadow-lg shadow-primary/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{user ? 'Back to Dashboard' : 'Back to Home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
