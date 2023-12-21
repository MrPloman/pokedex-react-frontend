import { createSlice } from "@reduxjs/toolkit";
import { Pokemon } from "../../interfaces/PokeApi.interface";
import { Player, PlayerName, PokemonStatus, Turn } from "../../interfaces/LogicGame.interface";
export interface BattleState {
    player1: Player;
    player2: Player;
    turns: Turn;
    actionsDisplay: {
        actions: {
            show: boolean;
            selected: {
                movements: boolean;
                team: boolean;
            };
        };
        text: { value: string; status: number };
    };
    loading: boolean;
    finished: boolean;
    winner: PlayerName | undefined;
}
export const battleSlice = createSlice({
    name: "battle",
    initialState: <BattleState>{
        player1: {
            name: "player1",
            pokemons: [],
        },
        player2: {
            name: "player2",
            pokemons: [],
        },
        turns: {
            turn: undefined,
            turnNumber: 0,
        },
        actionsDisplay: {
            actions: {
                show: false,
                selected: {
                    movements: false,
                    team: false,
                },
            },
            text: { value: "", status: 0 },
        },
        loading: true,
        finished: false,
        winner: undefined,
    },
    reducers: {
        setLoading: (
            state: BattleState,
            action: { payload: { loading: boolean }; type: string }
        ) => {
            state.loading = action.payload.loading;
        },
        setPokemonsPlayer: (
            state: BattleState,
            action: { payload: { pokemons: PokemonStatus[]; name: PlayerName }; type: string }
        ) => {
            state[action.payload.name].pokemons = action.payload.pokemons;
        },
        updatePokemonsPlayer: (
            state: BattleState,
            action: { payload: { pokemon: PokemonStatus; name: PlayerName }; type: string }
        ) => {
            if (!action.payload.name || !action.payload.pokemon) return;
            state[action.payload.name].pokemons = [
                ...state[action.payload.name].pokemons.map((pokemonSaved) => {
                    if (pokemonSaved.id === action.payload.pokemon.id) {
                        return action.payload.pokemon;
                    } else return pokemonSaved;
                }),
            ];
        },
        defeatPokemonsPlayer: (
            state: BattleState,
            action: { payload: { id: number; name: PlayerName }; type: string }
        ) => {
            if (!action.payload.name || !action.payload.id) return;
            state[action.payload.name].pokemons = state[action.payload.name].pokemons.filter(
                (pokemonSaved: PokemonStatus) => pokemonSaved.id === action.payload.id
            );
        },
        setActionsDisplay: (
            state: BattleState,
            action: {
                payload: {
                    actions: {
                        show: boolean;
                        selected: {
                            movements: boolean;
                            team: boolean;
                        };
                    };
                    text: { value: string; status: number };
                };
                type: string;
            }
        ) => {
            state.actionsDisplay = action.payload;
        },
        setWhoGoesFirst: (state: BattleState, action: { payload: PlayerName }) => {
            state.turns = { ...state.turns, turn: action.payload };
        },
        updateTurn: (state: BattleState, action: { payload: number }) => {
            state.turns = { ...state.turns, turnNumber: action.payload };
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setPokemonsPlayer,
    updatePokemonsPlayer,
    defeatPokemonsPlayer,
    setLoading,
    setActionsDisplay,
    setWhoGoesFirst,
    updateTurn,
} = battleSlice.actions;
export default battleSlice.reducer;
