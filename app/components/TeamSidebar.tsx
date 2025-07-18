import React from 'react';
import { Pokemon } from '../types/pokemon';

interface TeamSidebarProps {
  team: Pokemon[];
  onRemovePokemon: (pokemonId: number) => void;
  teamName: string;
  removingPokemonId?: number | null;
}

export const TeamSidebar: React.FC<TeamSidebarProps> = ({
  team,
  onRemovePokemon,
  teamName,
  removingPokemonId,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{teamName}</h3>
        <span className="text-sm text-gray-500">{team.length}/6</span>
      </div>

      {team.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">Your team is empty.</p>
          <p className="text-xs text-gray-400 mt-1">Search and add Pokemon!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {team.map((pokemon) => {
            const isRemoving = removingPokemonId === pokemon.id;
            
            return (
            <div
              key={pokemon.id}
              className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg transition-all duration-200 ${
                isRemoving ? 'opacity-50 cursor-wait' : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/48/48';
                }}
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 capitalize truncate">
                  {pokemon.name}
                </h4>
                <div className="flex gap-1 mt-1">
                  {pokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getTypeColor(type.type.name)}`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onRemovePokemon(pokemon.id)}
                disabled={isRemoving}
                className={`p-1 transition-all duration-200 ${
                  isRemoving 
                    ? 'text-gray-300 cursor-wait' 
                    : 'text-gray-400 hover:text-red-600'
                }`}
                title={isRemoving ? 'Removing...' : 'Remove from team'}
              >
                {isRemoving ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          )})}
        </div>
      )}

      {team.length === 6 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium text-center">
           Your team is complete!
          </p>
        </div>
      )}
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