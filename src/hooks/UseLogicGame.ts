import { useState } from "react";
import { Player, PokemonStatus } from "../interfaces/LogicGame.interface";
import { useDispatch, useSelector } from "react-redux";
import { PokeApiRequests } from "../helpers/pokedex-api.helper";
import axios from "axios";

import { Pokemon } from "../interfaces/PokeApi.interface";
import { setPokemonsPlayer, setLoading } from "../store/slices/battle.slice";

export const UseLogicGame = () => {
    const { getPokemonByNumber } = PokeApiRequests();
    const { selectedPokemons } = useSelector((state: any) => state.pokemonStore);
    const { player1, player2, loading } = useSelector((state: any) => state.battleStore);

    const dispatch = useDispatch();
    const init = () => {
        dispatch(setPokemonsPlayer({ name: "player1", pokemons: selectedPokemons }));
        getOpponentPokemons();
    };
    const getOpponentPokemons = async () => {
        dispatch(setLoading({ loading: true }));
        const cancelToken = axios.CancelToken.source();
        let pokemons: PokemonStatus[] = [];
        let randomPokemonNumbers: number[] = [];
        for (let index = 0; index < 6; index++) {
            randomPokemonNumbers = [...randomPokemonNumbers, Math.floor(Math.random() * 1000) + 1];
        }
        for (const number of randomPokemonNumbers) {
            await getPokemonByNumber(number, cancelToken).then(async (res: any) => {
                if (!res.data || res.status !== 200) {
                    return;
                } else {
                    pokemons = [...pokemons, { ...res.data, health: 100, defeated: false }];
                    await dispatch(setPokemonsPlayer({ name: "player2", pokemons: pokemons }));
                }
            });
        }
        await dispatch(setLoading({ loading: false }));
    };

    return {
        init,
    };
};
