import React from 'react';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onAddToTeam: (pokemon: Pokemon) => void;
  isInTeam: boolean;
  isAddingToTeam?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onAddToTeam,
  isInTeam,
  isAddingToTeam = false,
}) => {
  const handleAddToTeam = () => {
    if (!isAddingToTeam && !isInTeam) {
      onAddToTeam(pokemon);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      {/* Pokemon Image */}
      <div className="text-center mb-4">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto object-contain"
          onError={(e) => {
            e.currentTarget.src = pokemon.sprites.front_default;
          }}
        />
      </div>

      {/* Pokemon Info */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2">
          {pokemon.name}
        </h2>
        
        {/* Types */}
        <div className="flex justify-center gap-2 mb-3">
          {pokemon.types.map((type, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-sm font-medium rounded-full text-white ${getTypeColor(type.type.name)}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="text-center">
            <p className="font-medium text-gray-800">{pokemon.base_experience}</p>
            <p className="text-xs">Base EXP</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-800">{pokemon.height / 10}m</p>
            <p className="text-xs">Height</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-800">{pokemon.weight / 10}kg</p>
            <p className="text-xs">Weight</p>
          </div>
        </div>
      </div>

      {/* Add to Team Button */}
      <button
        onClick={handleAddToTeam}
        disabled={isInTeam || isAddingToTeam}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          isInTeam
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isAddingToTeam
            ? 'bg-blue-400 text-white cursor-wait'
            : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
        }`}
      >
        {isAddingToTeam ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding to Team...
          </>
        ) : isInTeam ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            In Team
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add to Team
          </>
        )}
      </button>
    </div>
  );
};

// Helper function to get type colors
const getTypeColor = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };
  
  return typeColors[type] || 'bg-gray-400';
};