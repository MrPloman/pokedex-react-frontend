import { Pokemon } from "./PokeApi.interface";
export type PlayerName = "player1" | "player2";
export type actionType = "movement" | "change";
export type PokemonTypes =
    | "normal"
    | "fighting"
    | "flying"
    | "poison"
    | "ground"
    | "rock"
    | "bug"
    | "ghost"
    | "steel"
    | "fire"
    | "water"
    | "grass"
    | "electric"
    | "psychic"
    | "ice"
    | "dragon"
    | "dark"
    | "fairy"
    | "unknown"
    | "shadow";

export interface PokemonStatus extends Pokemon {
    health: number;
    defeated: boolean;
}

export interface Player {
    name: PlayerName;
    pokemons: PokemonStatus[];
}

export interface Turn {
    turn: PlayerName | undefined;
    turnNumber: number;
}
