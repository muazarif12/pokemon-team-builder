import { Team } from "../types/pokemon";
export const TeamSelector = ({ 
  currentTeam, 
  teams, 
  onOpenManagement 
}: { 
  currentTeam: Team | null; 
  teams: Team[]; 
  onOpenManagement: () => void; 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {currentTeam ? currentTeam.name : 'No Team Selected'}
          </h2>
          <p className="text-sm text-gray-600">
            {currentTeam ? `${currentTeam.pokemon.length}/6 Pokémon` : 'Create or select a team'}
          </p>
        </div>
        <button
          onClick={onOpenManagement}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Manage Teams
        </button>
      </div>
    </div>
  );
};

export{ }