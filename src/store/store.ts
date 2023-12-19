import { configureStore } from "@reduxjs/toolkit";
import { currentPokemonSlice } from "./slices/currentPokemon.slice";
import { battleSlice } from "./slices/battle.slice";

export default configureStore({
    reducer: {
        pokemonStore: currentPokemonSlice.reducer,
        battleStore: battleSlice.reducer,
    },
});
