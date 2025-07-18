import { Team } from "../types/pokemon";

export const TeamSidebar = ({ 
  currentTeam, 
  onRemovePokemon 
}: { 
  currentTeam: Team | null; 
  onRemovePokemon: (id: number) => void; 
}) => {
  const team = currentTeam?.pokemon || [];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Your Team ({team.length}/6)
      </h2>
      
      {team.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No Pokémon in your team yet.<br />
          Search and add some!
        </p>
      ) : (
        <div className="space-y-3">
          {team.map((pokemon) => (
            <div key={pokemon.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-12 h-12 object-contain"
              />
              <div className="flex-1">
                <p className="font-medium capitalize text-gray-800">{pokemon.name}</p>
                <div className="flex gap-1 mt-1">
                  {pokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded"
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onRemovePokemon(pokemon.id)}
                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                title="Remove from team"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {team.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => team.forEach(pokemon => onRemovePokemon(pokemon.id))}
            className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg font-medium transition-colors text-sm"
          >
            Clear Team
          </button>
        </div>
      )}
    </div>
  );
};

export{ }