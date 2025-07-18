export interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
    base_experience: number;
    height: number;
    weight: number;
}

export interface Team {
    id: string;
    name: string;
    pokemon: Pokemon[];
    createdAt: string;
    updatedAt?: string;
}


export { }