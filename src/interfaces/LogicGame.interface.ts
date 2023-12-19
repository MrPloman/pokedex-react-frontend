import { Pokemon } from "./PokeApi.interface";
export type PlayerName = "player1" | "player2";

export interface PokemonStatus extends Pokemon {
    health: number;
    defeated: boolean;
}

export interface Player {
    name: PlayerName;
    pokemons: PokemonStatus[];
}

export interface Turn {
    turn: PlayerName;
    turnNumber: number;
}
