import { Team } from "@/app/types/pokemon";
import { Pokemon } from "@/app/types/pokemon";
import { useState } from "react";
export class DatabaseService {
  public static SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';; // Replace with your Supabase URL
  public static SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  public static API_URL = `${this.SUPABASE_URL}/rest/v1`;

  public static headers = {
    'Content-Type': 'application/json',
    'apikey': this.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`
  };

  // Get all teams
  static async getTeams(): Promise<Team[]> {
    try {
      const response = await fetch(`${this.API_URL}/teams?select=*&order=created_at.desc`, {
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }

      const data = await response.json();
      return data.map((team: any) => ({
        id: team.id,
        name: team.name,
        pokemon: JSON.parse(team.pokemon_data || '[]'),
        createdAt: team.created_at,
        updatedAt: team.updated_at
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  // Create a new team
  static async createTeam(name: string): Promise<Team | null> {
    try {
      const team = {
        id: Date.now().toString(),
        name,
        pokemon_data: JSON.stringify([]), // Explicitly initialize as empty array
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };


      const response = await fetch(`${this.API_URL}/teams`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(team)
      });

      if (!response.ok) {
        throw new Error('Failed to create team');
      }

      const data = await response.json();
      return {
        id: data[0].id,
        name: data[0].name,
        pokemon: [],
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at
      };
    } catch (error) {
      console.error('Error creating team:', error);
      return null;
    }
  }

  // Update team
  static async updateTeam(teamId: string, updates: Partial<{ name: string; pokemon: Pokemon[] }>): Promise<boolean> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.name) {
        updateData.name = updates.name;
      }

      if (updates.pokemon) {
        updateData.pokemon_data = JSON.stringify(updates.pokemon);
      }

      const response = await fetch(`${this.API_URL}/teams?id=eq.${teamId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(updateData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating team:', error);
      return false;
    }
  }

  // Delete team
  static async deleteTeam(teamId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/teams?id=eq.${teamId}`, {
        method: 'DELETE',
        headers: this.headers
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting team:', error);
      return false;
    }
  }
}



// Team Management Modal Component
export const TeamManagementModal = ({
  isOpen,
  onClose,
  teams,
  currentTeam,
  onCreateTeam,
  onSwitchTeam,
  onRenameTeam,
  onDeleteTeam
}: {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  currentTeam: Team | null;
  onCreateTeam: (name: string) => void;
  onSwitchTeam: (teamId: string) => void;
  onRenameTeam: (teamId: string, newName: string) => void;
  onDeleteTeam: (teamId: string) => void;
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      onCreateTeam(newTeamName.trim());
      setNewTeamName('');
    }
  };

  const handleRenameTeam = (teamId: string) => {
    if (editName.trim()) {
      onRenameTeam(teamId, editName.trim());
      setEditingTeamId(null);
      setEditName('');
    }
  };

  const startEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setEditName(team.name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Manage Teams</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-64">
          {/* Create New Team */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Create New Team
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateTeam()}
              />
              <button
                onClick={handleCreateTeam}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Create
              </button>
            </div>
          </div>

          {/* Teams List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Teams ({teams.length})
            </label>
            <div className="space-y-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-3 border rounded-lg ${currentTeam?.id === team.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingTeamId === team.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleRenameTeam(team.id)}
                          />
                          <button
                            onClick={() => handleRenameTeam(team.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTeamId(null)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-800">{team.name}</h4>
                            {currentTeam?.id === team.id && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {team.pokemon.length}/6 Pokémon
                          </p>
                        </div>
                      )}
                    </div>

                    {editingTeamId !== team.id && (
                      <div className="flex gap-1">
                        {currentTeam?.id !== team.id && (
                          <button
                            onClick={() => onSwitchTeam(team.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1"
                          >
                            Switch
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(team)}
                          className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1"
                        >
                          Rename
                        </button>
                        {teams.length > 1 && (
                          <button
                            onClick={() => onDeleteTeam(team.id)}
                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Selector Component



export { }