export interface PokemonInt {
  abilities: Array<Record<string, unknown>>;
  base_experience: number;
  forms: Array<Record<string, unknown>>;
  game_indices: Array<Record<string, unknown>>;
  height: number;
  held_items: Array<Record<string, unknown>>;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Array<Record<string, unknown>>;
  name: string;
  order: number;
  species: { name: string; url: string };
  sprites: {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
  };
  stats: Array<Record<string, unknown>>;
  types: Array<Record<string, unknown>>;
  weight: number;
}
