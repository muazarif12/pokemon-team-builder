"use client"
import { useState, useEffect } from "react";
import { Pokemon } from "../types/pokemon";
import { LoadingSpinner } from "./loadingComponent";
import { PokemonCard } from "./PokemonCard";
import { ErrorMessage } from "./errorComponent";
import { TeamSidebar } from "./TeamSidebar";
import { TeamStats } from "./TeamStats";
import { DatabaseService } from "@/supabase/Service";
import { Team } from "../types/pokemon";
import { TeamSelector } from "./TeamSelector";
import { TeamManagementModal } from "@/supabase/Service";

import React from "react";
export const PokemonSearchApp: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
    const [showTeamManagement, setShowTeamManagement] = useState(false);

    const [dbLoading, setDbLoading] = useState(true);

    // Check if database is configured
    // Get current team
    const currentTeam = teams.find(team => team.id === currentTeamId) || null;

    // Check if database is configured
    const isDatabaseConfigured = () => {
        return DatabaseService.SUPABASE_URL && DatabaseService.SUPABASE_ANON_KEY;
    };

    // Load teams from database on component mount
    useEffect(() => {
        const loadTeams = async () => {
            if (!isDatabaseConfigured()) {
                
                setDbLoading(false);
                return;
            }

            try {
                const teams = await DatabaseService.getTeams();
                if (teams.length > 0) {
                    setTeams(teams);
                    setCurrentTeamId(teams[0].id);
                } else {
                    // Create default team if none exist
                    await createTeam('My First Team');
                }
            } catch (error) {
                console.error("Failed to load teams:", error);
                setError("Failed to load teams from database");
            } finally {
                setDbLoading(false);
            }
        };

        loadTeams();
    }, []);
    const refreshTeams = async () => {
        try {
            const updatedTeams = await DatabaseService.getTeams();
            setTeams(updatedTeams);
        } catch (error) {
            console.error("Failed to refresh teams:", error);
        }
    };
    // Team management functions
    const createTeam = async (name: string) => {
        setDbLoading(true);
        try {
            const newTeam = await DatabaseService.createTeam(name);
            if (newTeam) {
                // Refresh the team list from server instead of local state update
                const updatedTeams = await DatabaseService.getTeams();
                setTeams(updatedTeams);
                setCurrentTeamId(newTeam.id);
                await refreshTeams();
            }
        } catch (error) {
            console.error("Failed to create team:", error);
            setError("Failed to create team");
        } finally {
            setDbLoading(false);
        }
    };

    const updateTeam = async (teamId: string, updates: Partial<{ name: string; pokemon: Pokemon[] }>) => {
        setDbLoading(true);
        try {
            const success = await DatabaseService.updateTeam(teamId, updates);
            if (success) {
                setTeams(prevTeams =>
                    prevTeams.map(team =>
                        team.id === teamId ? { ...team, ...updates } : team
                    )
                );
            }
        } catch (error) {
            console.error("Failed to update team:", error);
            setError("Failed to update team");
        } finally {
            setDbLoading(false);
        }
    };

    const deleteTeam = async (teamId: string) => {
        if (teams.length <= 1) {
            alert("You must have at least one team!");
            return;
        }

        setDbLoading(true);
        try {
            const success = await DatabaseService.deleteTeam(teamId);
            if (success) {
                setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));

                // Switch to first available team if deleting current team
                if (currentTeamId === teamId) {
                    setCurrentTeamId(teams[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to delete team:", error);
            setError("Failed to delete team");
        } finally {
            setDbLoading(false);
        }
    };

    const addToTeam = async (pokemonToAdd: Pokemon) => {
        if (!currentTeamId) {
            alert('Please select a team first!');
            return;
        }

        const currentTeam = teams.find(t => t.id === currentTeamId);
        if (!currentTeam) return;

        if (currentTeam.pokemon.length >= 6) {
            alert('Your team is full! You can only have 6 Pokémon.');
            return;
        }

        if (currentTeam.pokemon.some(p => p.id === pokemonToAdd.id)) {
            alert(`${pokemonToAdd.name} is already in your team!`);
            return;
        }

        const updatedPokemon = [...currentTeam.pokemon, pokemonToAdd];
        await updateTeam(currentTeamId, { pokemon: updatedPokemon });
    };

    const removeFromTeam = async (pokemonId: number) => {
        if (!currentTeamId) return;

        const currentTeam = teams.find(t => t.id === currentTeamId);
        if (!currentTeam) return;

        const updatedPokemon = currentTeam.pokemon.filter(p => p.id !== pokemonId);
        await updateTeam(currentTeamId, { pokemon: updatedPokemon });
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

                {/* Loading Overlay */}
                {(dbLoading || loading) && (
                    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
                        <div className="bg-white rounded-lg p-4 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-gray-700">
                                    {dbLoading ? 'Syncing with database...' : 'Loading...'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Team Selector */}
                        <TeamSelector
                            currentTeam={currentTeam}
                            teams={teams}
                            onOpenManagement={() => setShowTeamManagement(true)}
                        />

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
                        <TeamSidebar currentTeam={currentTeam} onRemovePokemon={removeFromTeam} />
                        <TeamStats currentTeam={currentTeam} />
                    </div>
                </div>

                {/* Team Management Modal */}
                <TeamManagementModal
                    isOpen={showTeamManagement}
                    onClose={() => setShowTeamManagement(false)}
                    teams={teams}
                    currentTeam={currentTeam}
                    onCreateTeam={createTeam}
                    onSwitchTeam={(teamId) => setCurrentTeamId(teamId)}
                    onRenameTeam={(teamId, newName) => updateTeam(teamId, { name: newName })}
                    onDeleteTeam={deleteTeam}
                />

            </div>
        </div>
    );
}
export { }