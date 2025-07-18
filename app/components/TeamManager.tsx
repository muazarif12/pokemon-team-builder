import React, { useState } from 'react';
import { Team } from '../types/pokemon';
interface TeamManagerProps {
  teams: Team[];
  currentTeam: Team | null;
  onCreateTeam: (name: string) => Promise<boolean>;
  onRenameTeam: (teamId: string, newName: string) => Promise<boolean>;
  onDeleteTeam: (teamId: string) => Promise<boolean>;
  onSwitchTeam: (team: Team) => void;
}

export const TeamManager: React.FC<TeamManagerProps> = ({
  teams,
  currentTeam,
  onCreateTeam,
  onRenameTeam,
  onDeleteTeam,
  onSwitchTeam,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setLoading(true);
    const success = await onCreateTeam(newTeamName.trim());
    if (success) {
      setNewTeamName('');
      setShowCreateForm(false);
    } else {
      alert('Failed to create team. Please try again.');
    }
    setLoading(false);
  };

  const handleRenameTeam = async (e: React.FormEvent, teamId: string) => {
    e.preventDefault();
    if (!editTeamName.trim()) return;

    setLoading(true);
    const success = await onRenameTeam(teamId, editTeamName.trim());
    if (success) {
      setEditingTeam(null);
      setEditTeamName('');
    } else {
      alert('Failed to rename team. Please try again.');
    }
    setLoading(false);
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (teams.length === 1) {
      alert('You cannot delete your last team!');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${teamName}"? This action cannot be undone.`);
    if (!confirmed) return;

    setLoading(true);
    const success = await onDeleteTeam(teamId);
    if (!success) {
      alert('Failed to delete team. Please try again.');
    }
    setLoading(false);
  };

  const startEdit = (team: Team) => {
    setEditingTeam(team.id);
    setEditTeamName(team.name);
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    setEditTeamName('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">My Teams</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
          disabled={loading}
        >
          {showCreateForm ? 'Cancel' : '+ New Team'}
        </button>
      </div>

      {/* Create Team Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateTeam} className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter team name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              maxLength={50}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!newTeamName.trim() || loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Teams List */}
      <div className="space-y-2">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
              currentTeam?.id === team.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex-1">
              {editingTeam === team.id ? (
                <form onSubmit={(e) => handleRenameTeam(e, team.id)} className="flex gap-2">
                  <input
                    type="text"
                    value={editTeamName}
                    onChange={(e) => setEditTeamName(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={50}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!editTeamName.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSwitchTeam(team)}
                    className={`flex-1 text-left font-medium transition-colors duration-200 ${
                      currentTeam?.id === team.id
                        ? 'text-blue-700'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    disabled={loading}
                  >
                    {team.name}
                  </button>
                  <span className="text-xs text-gray-500">
                    {team.pokemon.length}/6
                  </span>
                  {currentTeam?.id === team.id && (
                    <span className="text-xs text-blue-600 font-medium">ACTIVE</span>
                  )}
                </div>
              )}
            </div>

            {editingTeam !== team.id && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(team)}
                  className="text-gray-500 hover:text-blue-600 p-1 transition-colors duration-200"
                  disabled={loading}
                  title="Rename team"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id, team.name)}
                  className="text-gray-500 hover:text-red-600 p-1 transition-colors duration-200"
                  disabled={loading || teams.length === 1}
                  title={teams.length === 1 ? "Cannot delete your last team" : "Delete team"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No teams yet. Create your first team!</p>
        </div>
      )}
    </div>
  );
};