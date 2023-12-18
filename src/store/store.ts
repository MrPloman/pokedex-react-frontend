import { configureStore } from "@reduxjs/toolkit";
import { currentPokemonSlice } from "./slices/currentPokemon.slice";

export default configureStore({
    reducer: {
        pokemonStore: currentPokemonSlice.reducer,
    },
});
