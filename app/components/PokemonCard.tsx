import { Pokemon } from "../types/pokemon";

export const PokemonCard: React.FC<{ pokemon: Pokemon; onAddToTeam: (pokemon: Pokemon) => void; isInTeam: boolean }> = ({ pokemon, onAddToTeam, isInTeam }) => {
  const getTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="text-center">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto mb-4 object-contain"
        />
        <h3 className="text-xl font-bold mb-2 capitalize text-gray-800">
          {pokemon.name}
        </h3>
        
        {/* Types */}
        <div className="flex justify-center gap-2 mb-3">
          {pokemon.types.map((type, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(type.type.name)}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Base Experience:</span> {pokemon.base_experience}</p>
          <p><span className="font-medium">Height:</span> {pokemon.height / 10}m</p>
          <p><span className="font-medium">Weight:</span> {pokemon.weight / 10}kg</p>
        </div>

        {/* Add to Team Button */}
        <button
          onClick={() => onAddToTeam(pokemon)}
          disabled={isInTeam}
          className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            isInTeam
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isInTeam ? 'In Team ✓' : 'Add to Team'}
        </button>
      </div>
    </div>
  );
};

export{ }