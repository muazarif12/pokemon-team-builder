"use client"
import { useState, useEffect } from "react";
import { Team, Pokemon } from '../types/pokemon'
import { LoadingSpinner } from "./loadingComponent";
import { PokemonCard } from "./PokemonCard";
import { ErrorMessage } from "./errorComponent";
import { TeamSidebar } from "./TeamSidebar";
import { TeamStats } from "./TeamStats";
import { TeamManager } from "./TeamManager";
import { DatabaseService } from "../lib/database";

export const PokemonSearchApp: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Multi-team state
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamsLoading, setTeamsLoading] = useState(true);
  
  // Loading states for Pokemon operations
  const [addingPokemon, setAddingPokemon] = useState(false);
  const [removingPokemon, setRemovingPokemon] = useState<number | null>(null);

  // Initialize teams on component mount
  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setTeamsLoading(true);
    const allTeams = await DatabaseService.getAllTeams();
    setTeams(allTeams);
    
    // If no teams exist, create a default one
    if (allTeams.length === 0) {
      const defaultTeam = await DatabaseService.createTeam('My First Team');
      if (defaultTeam) {
        setTeams([defaultTeam]);
        setCurrentTeam(defaultTeam);
      }
    } else {
      // Set the first team as current if none selected
      if (!currentTeam) {
        setCurrentTeam(allTeams[0]);
      }
    }
    setTeamsLoading(false);
  };

  const createNewTeam = async (name: string) => {
    const newTeam = await DatabaseService.createTeam(name);
    if (newTeam) {
      setTeams(prev => [newTeam, ...prev]);
      setCurrentTeam(newTeam);
      return true;
    }
    return false;
  };

  const renameTeam = async (teamId: string, newName: string) => {
    const success = await DatabaseService.renameTeam(teamId, newName);
    if (success) {
      const updatedTeams = teams.map(team => 
        team.id === teamId ? { ...team, name: newName } : team
      );
      setTeams(updatedTeams);
      if (currentTeam?.id === teamId) {
        setCurrentTeam(prev => prev ? { ...prev, name: newName } : null);
      }
      return true;
    }
    return false;
  };

  const deleteTeam = async (teamId: string) => {
    const success = await DatabaseService.deleteTeam(teamId);
    if (success) {
      const updatedTeams = teams.filter(team => team.id !== teamId);
      setTeams(updatedTeams);
      
      // If we deleted the current team, switch to another one
      if (currentTeam?.id === teamId) {
        if (updatedTeams.length > 0) {
          setCurrentTeam(updatedTeams[0]);
        } else {
          // Create a new default team if no teams left
          const defaultTeam = await DatabaseService.createTeam('My Team');
          if (defaultTeam) {
            setTeams([defaultTeam]);
            setCurrentTeam(defaultTeam);
          }
        }
      }
      return true;
    }
    return false;
  };

  const switchTeam = (team: Team) => {
    setCurrentTeam(team);
  };

  // Updated team management functions with loading states
  const addToTeam = async (pokemonToAdd: Pokemon) => {
    if (!currentTeam) {
      alert('Please select a team first!');
      return;
    }

    // Check if team is full
    if (currentTeam.pokemon.length >= 6) {
      alert('Your team is full! You can only have 6 Pokémon.');
      return;
    }

    // Check if Pokemon already exists in team
    if (currentTeam.pokemon.some(p => p.id === pokemonToAdd.id)) {
      alert(`${pokemonToAdd.name} is already in your team!`);
      return;
    }

    // Set loading state
    setAddingPokemon(true);

    try {
      // Add Pokemon to team
      const updatedTeam = await DatabaseService.addPokemonToTeam(currentTeam, pokemonToAdd);
      if (updatedTeam) {
        setCurrentTeam(updatedTeam);
        // Update the teams array as well
        setTeams(prev => prev.map(team => 
          team.id === updatedTeam.id ? updatedTeam : team
        ));
      } else {
        alert('Failed to add Pokemon to team. Please try again.');
      }
    } finally {
      setAddingPokemon(false);
    }
  };

  const removeFromTeam = async (pokemonId: number) => {
    if (!currentTeam) return;

    // Set loading state for this specific Pokemon
    setRemovingPokemon(pokemonId);

    try {
      const updatedTeam = await DatabaseService.removePokemonFromTeam(currentTeam, pokemonId);
      if (updatedTeam) {
        setCurrentTeam(updatedTeam);
        // Update the teams array as well
        setTeams(prev => prev.map(team => 
          team.id === updatedTeam.id ? updatedTeam : team
        ));
      } else {
        alert('Failed to remove Pokemon from team. Please try again.');
      }
    } finally {
      setRemovingPokemon(null);
    }
  };

  const isPokemonInTeam = (pokemonId: number) => {
    return currentTeam?.pokemon.some(p => p.id === pokemonId) || false;
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

  if (teamsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 ${
      addingPokemon || removingPokemon ? 'cursor-wait' : ''
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Pokemon Team Builder
          </h1>
        </div>

        {/* Team Manager */}
        <div className="mb-6">
          <TeamManager
            teams={teams}
            currentTeam={currentTeam}
            onCreateTeam={createNewTeam}
            onRenameTeam={renameTeam}
            onDeleteTeam={deleteTeam}
            onSwitchTeam={switchTeam}
          />
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
                  placeholder="Enter Pokemon name (e.g pikachu)"
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
                    isAddingToTeam={addingPokemon}
                  />
                </div>
              )}
            </div>

            {/* Instructions */}
            {!pokemon && !loading && !error && (
              <div className="text-center text-gray-600 mt-8">
                <p className="mb-2">Search for a Pokemon!</p>
                <p className="text-sm">You can search by name or use the quick search buttons above.</p>
              </div>
            )}
          </div>

          {/* Team Sidebar */}
          <div className="lg:col-span-1">
            <TeamSidebar 
              team={currentTeam?.pokemon || []} 
              onRemovePokemon={removeFromTeam} 
              teamName={currentTeam?.name || 'No Team Selected'}
              removingPokemonId={removingPokemon}
            />
            <TeamStats team={currentTeam?.pokemon || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { }