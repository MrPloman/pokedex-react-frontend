import { createSlice } from "@reduxjs/toolkit";
import { Pokemon } from "../../interfaces/PokeApi.interface";
interface PokemonState {
    currentPokemon: Pokemon | null;
    selectedPokemons: Pokemon[];
}
export const currentPokemonSlice = createSlice({
    name: "pokemons",
    initialState: <PokemonState>{
        currentPokemon: null,
        selectedPokemons: [],
    },
    reducers: {
        setCurrentPokemon: (state: PokemonState, action: { payload: Pokemon; type: string }) => {
            state.currentPokemon = action.payload;
        },
        setSelectedPokemons: (state: PokemonState, action: { payload: Pokemon; type: string }) => {
            if (state.selectedPokemons.length !== 6) {
                state.selectedPokemons = [...state.selectedPokemons, action.payload];
            } else {
                const pokes = state.selectedPokemons.slice(1, 6);
                state.selectedPokemons = [...pokes, action.payload];
            }
        },
        removeSelectedPokemon: (
            state: PokemonState,
            action: { payload: Pokemon; type: string }
        ) => {
            state.selectedPokemons = state.selectedPokemons.filter(
                (pokemonToFilter) => pokemonToFilter.id !== action.payload.id
            );
        },
    },
});

// Action creators are generated for each case reducer function
export const { setCurrentPokemon, setSelectedPokemons, removeSelectedPokemon } =
    currentPokemonSlice.actions;
export default currentPokemonSlice.reducer;
