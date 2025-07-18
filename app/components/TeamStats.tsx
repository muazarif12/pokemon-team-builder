import { Pokemon } from "../types/pokemon";
export const TeamStats = ({ team }: { team: Pokemon[] }) => {
  // Calculate unique types
  const getUniqueTypes = () => {
    const allTypes = team.flatMap(pokemon => 
      pokemon.types.map(type => type.type.name)
    );
    return [...new Set(allTypes)];
  };

  // Calculate average base experience
  const getAverageBaseExperience = () => {
    if (team.length === 0) return 0;
    const totalExp = team.reduce((sum, pokemon) => sum + (pokemon.base_experience || 0), 0);
    return Math.round(totalExp / team.length);
  };

  // Get type coverage percentage (out of 18 total types)
  const getTypeCoveragePercentage = () => {
    const uniqueTypes = getUniqueTypes();
    return Math.round((uniqueTypes.length / 18) * 100);
  };

  // Get team strength assessment
  const getTeamStrength = () => {
    const avgExp = getAverageBaseExperience();
    if (avgExp === 0) return { level: 'No Data', color: 'text-gray-500' };
    if (avgExp < 100) return { level: 'Beginner', color: 'text-green-600' };
    if (avgExp < 150) return { level: 'Intermediate', color: 'text-blue-600' };
    if (avgExp < 200) return { level: 'Advanced', color: 'text-purple-600' };
    return { level: 'Elite', color: 'text-red-600' };
  };

  const uniqueTypes = getUniqueTypes();
  const avgExp = getAverageBaseExperience();
  const typeCoverage = getTypeCoveragePercentage();
  const teamStrength = getTeamStrength();

  if (team.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Team Stats</h3>
        <p className="text-gray-500 text-center py-4">
          Add Pokemons to your team to see statistics!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Team Stats</h3>
      
      <div className="space-y-4">
        {/* Type Coverage */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Type Coverage</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-blue-600">{uniqueTypes.length}</span>
            <span className="text-sm text-blue-600">/ 18 types</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${typeCoverage}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-700">{typeCoverage}% coverage</p>
          
          {/* Type badges */}
          {uniqueTypes.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-blue-600 mb-2">Types covered:</p>
              <div className="flex flex-wrap gap-1">
                {uniqueTypes.map(type => (
                  <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Average Base Experience */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Team Strength</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-green-600">{avgExp}</span>
            <span className="text-sm text-green-600">avg base exp</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`font-medium ${teamStrength.color}`}>
              {teamStrength.level}
            </span>
            <span className="text-sm text-green-600">
              {team.length} Pokémon
            </span>
          </div>
        </div>

        {/* Team Composition */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Composition</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-700">Team Size:</span>
              <span className="font-medium text-purple-800">{team.length}/6</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-700">Unique Types:</span>
              <span className="font-medium text-purple-800">{uniqueTypes.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-700">Avg Height:</span>
              <span className="font-medium text-purple-800">
                {team.length > 0 ? 
                  `${(team.reduce((sum, p) => sum + p.height, 0) / team.length / 10).toFixed(1)}m` : 
                  '0m'
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-700">Avg Weight:</span>
              <span className="font-medium text-purple-800">
                {team.length > 0 ? 
                  `${(team.reduce((sum, p) => sum + p.weight, 0) / team.length / 10).toFixed(1)}kg` : 
                  '0kg'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export{ }