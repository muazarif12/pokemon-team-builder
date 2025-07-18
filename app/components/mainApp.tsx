"use client"
import { useState } from "react";
import { Pokemon } from "../types/pokemon";
import { LoadingSpinner } from "./loadingComponent";
import { PokemonCard } from "./PokemonCard";
import { ErrorMessage } from "./errorComponent";
import { TeamSidebar } from "./TeamSidebar";
import { TeamStats } from "./TeamStats";

export const PokemonSearchApp: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<Pokemon[]>([]);

  // Team management functions
  const addToTeam = (pokemonToAdd: Pokemon) => {
    // Check if team is full
    if (team.length >= 6) {
      alert('Your team is full! You can only have 6 Pokémon.');
      return;
    }

    // Check if Pokemon already exists in team
    if (team.some(p => p.id === pokemonToAdd.id)) {
      alert(`${pokemonToAdd.name} is already in your team!`);
      return;
    }

    // Add Pokemon to team
    setTeam(prevTeam => [...prevTeam, pokemonToAdd]);
  };

  const removeFromTeam = (pokemonId: number) => {
    setTeam(prevTeam => prevTeam.filter(p => p.id !== pokemonId));
  };

  const isPokemonInTeam = (pokemonId: number) => {
    return team.some(p => p.id === pokemonId);
  };

  const searchPokemon = async (name: string) => {
    if (!name.trim()) {
      setPokemon(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error(`Pokemon "${name}" not found. Try names like "pikachu", "charizard", or "bulbasaur".`);
      }

      const data: Pokemon = await response.json();
      setPokemon(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    searchPokemon(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Quick search buttons for testing
  const quickSearchPokemon = ['pikachu', 'charizard', 'blastoise', 'venusaur', 'lucario', 'garchomp'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Pokémon Team Builder
          </h1>
          <p className="text-gray-600">Search for Pokémon and build your dream team!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Enter Pokémon name (e.g., pikachu)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
                >
                  Search
                </button>
              </div>

              {/* Quick Search Buttons */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Quick search:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSearchPokemon.map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        setSearchTerm(name);
                        searchPokemon(name);
                      }}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition-colors duration-200"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex justify-center">
              {loading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} />}
              {pokemon && !loading && !error && (
                <div className="w-full max-w-md">
                  <PokemonCard 
                    pokemon={pokemon} 
                    onAddToTeam={addToTeam}
                    isInTeam={isPokemonInTeam(pokemon.id)}
                  />
                </div>
              )}
            </div>

            {/* Instructions */}
            {!pokemon && !loading && !error && (
              <div className="text-center text-gray-600 mt-8">
                <p className="mb-2">🔍 Try searching for a Pokémon!</p>
                <p className="text-sm">You can search by name or use the quick search buttons above.</p>
              </div>
            )}
          </div>

          {/* Team Sidebar */}
          <div className="lg:col-span-1">
            <TeamSidebar team={team} onRemovePokemon={removeFromTeam} />
            <TeamStats team={team} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { }