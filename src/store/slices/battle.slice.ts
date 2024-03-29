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
    lastMovement: { name: string; url: string };
    processing: boolean;
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
            turnNumber: 1,
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
        lastMovement: {
            name: "",
            url: "",
        },
        processing: false,
        loading: true,
        finished: false,
        winner: undefined,
    },
    reducers: {
        setProcessing: (
            state: BattleState,
            action: { payload: { processing: boolean }; type: string }
        ) => {
            state.processing = action.payload.processing;
        },
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
                (pokemonSaved: PokemonStatus) => pokemonSaved.id !== action.payload.id
            );
        },
        injurePokemonPlayer: (
            state: BattleState,
            action: { payload: { id: number; name: PlayerName; injure: number }; type: string }
        ) => {
            if (!action.payload.name || !action.payload.id) return;
            let pokemon = state[action.payload.name].pokemons.find(
                (pokemonSaved: PokemonStatus) => pokemonSaved.id === action.payload.id
            );
            if (!!pokemon && pokemon.health > 0) {
                pokemon.health -= action.payload.injure;
                state[action.payload.name].pokemons = [
                    ...state[action.payload.name].pokemons.map((poke) => {
                        if (poke.id === pokemon?.id) return pokemon;
                        else return poke;
                    }),
                ];
            }
            if (!!pokemon && pokemon.health <= 0) {
                pokemon.health = 0;
                pokemon.defeated = true;
                state[action.payload.name].pokemons = state[action.payload.name].pokemons.filter(
                    (pok) => pok.id !== pokemon?.id
                );
            }
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
        changePokemon: (
            state: BattleState,
            action: { payload: { pokemon: PokemonStatus; position: number } }
        ) => {
            console.log(action);
            state.player1.pokemons = state.player1.pokemons.filter((pokemonInside, index) => {
                if (index !== action.payload.position) return pokemonInside;
            });
            state.player1.pokemons = [action.payload.pokemon, ...state.player1.pokemons];
            console.log(state.player1.pokemons);
            // let firstPokemon = state.player1.pokemons[0];
            // state.player1.pokemons[0] = action.payload.pokemon;
            // state.player1.pokemons[action.payload.position] = firstPokemon;
            // let pokemonFound = state.player1.pokemons.find(
            //     (pok) => pok.id === action.payload.pokemon.id
            // );
            // if (pokemonFound) {
            //     state.player1.pokemons[0];
            // }
        },
        setWhoGoesFirst: (state: BattleState, action: { payload: PlayerName }) => {
            state.turns = { ...state.turns, turn: action.payload };
        },
        updateTurn: (state: BattleState, action: { payload: number }) => {
            state.turns = { ...state.turns, turnNumber: action.payload };
        },
        setLastMovement: (
            state: BattleState,
            action: { payload: { name: string; url: string } }
        ) => {
            state.lastMovement = action.payload;
        },
        setWinner: (state: BattleState, action: { payload: { playerName: PlayerName } }) => {
            state.winner = action.payload.playerName;
            state.finished = true;
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
    injurePokemonPlayer,
    setLastMovement,
    setProcessing,
    setWinner,
    changePokemon,
} = battleSlice.actions;
export default battleSlice.reducer;
