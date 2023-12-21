import { useState } from "react";
import { Player, PokemonStatus, actionType } from "../interfaces/LogicGame.interface";
import { useDispatch, useSelector } from "react-redux";
import { PokeApiRequests } from "../helpers/pokedex-api.helper";
import axios from "axios";

import { GameIndex, Pokemon } from "../interfaces/PokeApi.interface";
import {
    setPokemonsPlayer,
    setLoading,
    setActionsDisplay,
    setWhoGoesFirst,
} from "../store/slices/battle.slice";
import { GameLogic } from "../helpers/game-logic.helper";

export const UseLogicGame = () => {
    const { getDamage } = GameLogic();
    const { getPokemonByNumber } = PokeApiRequests();
    const { selectedPokemons } = useSelector((state: any) => state.pokemonStore);
    const { player1, player2, loading, actionsDisplay, turns } = useSelector(
        (state: any) => state.battleStore
    );
    const dispatch = useDispatch();
    const init = async () => {
        dispatch(setLoading({ loading: true }));
        const player1Pokemons = selectedPokemons.map((pokemon: any) => {
            return { ...pokemon, health: 100, defeated: false };
        });
        dispatch(setPokemonsPlayer({ name: "player1", pokemons: player1Pokemons }));
        await getOpponentPokemons().then((pokemonArray: any) => {
            if (pokemonArray && pokemonArray.length === 6) {
                dispatch(setPokemonsPlayer({ name: "player2", pokemons: pokemonArray }));
                dispatch(
                    setActionsDisplay({
                        ...actionsDisplay,
                        text: { value: `Player2 chooses ${pokemonArray[0].name}`, status: 0 },
                    })
                );

                dispatch(setLoading({ loading: false }));
            }

            // if (pokemonArray && pokemonArray.length === 6) {
            //     dispatch(setPokemonsPlayer({ name: "player2", pokemons: pokemonArray }));
            //     dispatch(setLoading({ loading: false }));
            // }
        });
    };
    const reset = () => {
        dispatch(
            setActionsDisplay({
                actions: {
                    show: false,
                    selected: {
                        movements: false,
                        team: false,
                    },
                },
                text: {
                    value: "",
                    status: 0,
                },
            })
        );
    };

    const nextText = (num: number, message?: string) => {
        let actions = {
            show: false,
            selected: { movements: false, team: false },
        };
        let text = "";
        if (num === 0) text = message ? message : `Player2 chooses ${player2[0].name}`;
        if (num === 1) {
            text = message ? message : "What would you do?";
            actions.show = true;
        }

        dispatch(
            setActionsDisplay({
                actions,
                text: { value: text, status: num },
            })
        );
    };
    const handleMovementsDisplay = (movements: boolean) => {
        dispatch(
            setActionsDisplay({
                ...actionsDisplay,
                actions: {
                    show: true,
                    selected: {
                        movements: movements,
                        team: false,
                    },
                },
            })
        );
    };
    const handleTeamsDisplay = (team: boolean) => {
        dispatch(
            setActionsDisplay({
                ...actionsDisplay,
                actions: {
                    show: true,
                    selected: {
                        movements: false,
                        team: team,
                    },
                },
            })
        );
    };
    const getOpponentPokemons = async () => {
        const cancelToken = axios.CancelToken.source();
        let pokemons: PokemonStatus[] = [];
        for (let index = 0; index < 6; index++) {
            const number = Math.floor(Math.random() * 1000) + 1;
            const pokemon = await getPokemonByNumber(number, cancelToken);
            pokemons = [...pokemons, { ...pokemon.data, health: 100, defeated: false }];
        }
        return await pokemons;
    };

    const battleAction = (action: {
        type: actionType;
        pokemon?: PokemonStatus;
        movement?: any;
    }) => {
        if (!action || !action.type) return;
        switch (action.type) {
            case "movement":
                fight(action.movement);
                break;
            case "change":
                break;

            default:
                break;
        }
    };

    const fight = (movement: any) => {
        if (
            player1.pokemons[0].stats.find((stat: any) => stat.stat.name === "speed").base_stat >=
            player2.pokemons[0].stats.find((stat: any) => stat.stat.name === "speed").base_stat
        ) {
            dispatch(setWhoGoesFirst("player1"));
            getDamage(movement, player1.pokemons[0], player2.pokemons[0]);
        } else {
            dispatch(setWhoGoesFirst("player2"));
            getDamage(movement, player2.pokemons[0], player1.pokemons[0]);
        }

        // if (turns.turn && turns.turn === "player1") {
        //     console.log("POKEMON1 VA PRIEMRO", movement);
        // } else {
        //     console.log("POKEMON2 VA PRIEMRO", movement);
        // }

        return;
    };

    return {
        init,
        nextText,
        handleMovementsDisplay,
        handleTeamsDisplay,
        reset,
        battleAction,
    };
};
