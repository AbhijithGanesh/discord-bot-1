export interface dndmonInt {
  _id: string;
  index: string;
  name: string;
  size: string;
  type: string;
  subtype: string;
  alignment: string;
  armor_class: number;
  hit_points: number;
  hit_dice: number;
  speed: Record<string, unknown>;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: Array<unknown>;
  damage_vulnerabilities: Array<unknown>;
  damage_immunities: Array<unknown>;
  condition_immunities: Array<unknown>;
  senses: Record<string, unknown>;
  languages: string;
  challenge_rating: number;
  special_abilities: Array<Record<string, unknown>>;
  actions: Array<Record<string, unknown>>;
  url: string;
}
