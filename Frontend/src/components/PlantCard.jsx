import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlantCard = ({ plant }) => {
  return (
    <div className="bg-brand-surface rounded-[1.25rem] overflow-hidden shadow-ambient hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="h-48 bg-brand-background flex items-center justify-center relative overflow-hidden">
        {plant.default_image ? (
          <img 
            src={plant.default_image} 
            alt={plant.common_name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://placehold.co/400x300/fbf9f8/1b5e20?text=No+Image';
            }}
          />
        ) : (
          <Leaf className="h-16 w-16 text-brand-surface-dim" />
        )}
        {/* Family / Species Epithet Chip */}
        <span className="absolute top-4 right-4 bg-brand-surface/90 backdrop-blur-sm text-brand-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {plant.family || plant.species_epithet || 'Unknown'}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-display font-bold text-brand-primary mb-1 capitalize">{plant.common_name}</h3>
        <p className="text-sm text-brand-on-surface-variant italic mb-4">{plant.scientific_name || 'Unknown Scientific Name'}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-[#e4e4cc] text-[#1b1d0e] text-xs rounded-md capitalize">
            Genus: {plant.genus || 'Unknown'}
          </span>
        </div>
        
        <Link 
          to={`/plants/${plant.id}`}
          className="block w-full text-center py-2 border-2 border-brand-surface-dim text-brand-on-surface hover:border-brand-primary hover:text-brand-primary rounded-[1rem] font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PlantCard;
