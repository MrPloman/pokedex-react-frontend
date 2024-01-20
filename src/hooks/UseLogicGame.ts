import { useState } from "react";
import { Player, PlayerName, PokemonStatus, actionType } from "../interfaces/LogicGame.interface";
import { useDispatch, useSelector } from "react-redux";
import { PokeApiRequests } from "../helpers/pokedex-api.helper";
import axios from "axios";

import { GameIndex, Pokemon } from "../interfaces/PokeApi.interface";
import {
    setPokemonsPlayer,
    setLoading,
    setActionsDisplay,
    setWhoGoesFirst,
    injurePokemonPlayer,
    updateTurn,
    setLastMovement,
    defeatPokemonsPlayer,
    setProcessing,
    setWinner,
    changePokemon,
} from "../store/slices/battle.slice";
import { GameLogic } from "../helpers/game-logic.helper";

export const UseLogicGame = () => {
    const LENGTH_POKEMONS_OPPONENT: number = 2;
    const { getDamage } = GameLogic();
    const { getPokemonByNumber } = PokeApiRequests();
    const { selectedPokemons } = useSelector((state: any) => state.pokemonStore);
    const { player1, player2, loading, actionsDisplay, turns, lastMovement } = useSelector(
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
            if (pokemonArray && pokemonArray.length === LENGTH_POKEMONS_OPPONENT) {
                dispatch(setPokemonsPlayer({ name: "player2", pokemons: pokemonArray }));
                dispatch(
                    setActionsDisplay({
                        ...actionsDisplay,
                        text: {
                            value: `Player2 chooses ${pokemonArray[0].name.toUpperCase()}`,
                            status: 0,
                        },
                    })
                );

                dispatch(setLoading({ loading: false }));
            }
        });
    };
    const reset = () => {
        dispatch(setLoading({ loading: false }));
    };

    const nextText = (num: number, message: string) => {
        console.table({ num, message });
        let actions = {
            show: false,
            selected: { movements: false, team: false },
        };
        let text = "";
        if (num === -2 || num === -1 || num === 3 || num === 4) {
            text = message && message;
        }
        if (num === 0)
            text = message ? message : `Player2 chooses ${player2.pokemons[0].name.toUpperCase()}`;
        if (num === 1) {
            text = message ? message : "What will you do?";
            actions.show = true;
        }
        if (num === 2 || num === 6) {
            text = message && message;
            actions.show = false;
            actions.selected.movements = false;
            actions.selected.team = false;
        }
        if (num === 5) {
            text = "Game Finished";
            actions.show = false;
            actions.selected.movements = false;
            actions.selected.team = false;
        }
        dispatch(setProcessing({ processing: false }));
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
        for (let index = 0; index < LENGTH_POKEMONS_OPPONENT; index++) {
            const number = Math.floor(Math.random() * 1000) + 1;
            const pokemon = await getPokemonByNumber(number, cancelToken);
            pokemons = [...pokemons, { ...pokemon.data, health: 100, defeated: false }];
        }
        return await pokemons;
    };

    const battleAction = async (action: {
        type: actionType;
        pokemon?: PokemonStatus;
        position?: number;
        movement?: any;
    }) => {
        if (!action || !action.type) return;
        dispatch(setProcessing({ processing: true }));

        switch (action.type) {
            case "movement":
                dispatch(setLastMovement(action.movement));
                dispatch(updateTurn(1));
                if (
                    player1.pokemons[0].stats.find((stat: any) => stat.stat.name === "speed")
                        .base_stat >=
                    player2.pokemons[0].stats.find((stat: any) => stat.stat.name === "speed")
                        .base_stat
                ) {
                    await turnPlayer1(action.movement).then(() => {
                        dispatch(updateTurn(2));
                        // turnPlayer2();
                    });
                } else {
                    await turnPlayer2().then(() => {
                        dispatch(updateTurn(2));

                        // turnPlayer1(action.movement);
                    });
                }
                break;
            case "change":
                if (action.pokemon && action.position) {
                    await dispatch(
                        changePokemon({ pokemon: action.pokemon, position: action.position })
                    );
                    dispatch(setWhoGoesFirst("player1"));
                    dispatch(updateTurn(2));
                    nextText(6, `${action.pokemon.name} is your choice`);
                }
                break;

            default:
                break;
        }
    };

    const slowerPokemonTurn = () => {
        if (turns.turnNumber !== 2) return;
        if (turns.turn === "player1") {
            dispatch(setWhoGoesFirst("player2"));
            turnPlayer2().then((value: any) => {
                if (value.defeated) {
                    nextText(
                        4,
                        `${player2.pokemons[0].name.toUpperCase()} used ${
                            value.movement.name
                        } with ${Math.round(value.damage)} and defeated the opponent`
                    );
                } else {
                    nextText(
                        3,
                        `${player2.pokemons[0].name.toUpperCase()} used ${value.movement} with ${
                            value.damage ? value.damage : 0
                        } of damage`
                    );
                }
            });
        } else {
            dispatch(setWhoGoesFirst("player1"));
            turnPlayer1(lastMovement).then((value: any) => {
                if (value) {
                    if (value.defeated) {
                        nextText(
                            4,
                            `${player1.pokemons[0].name.toUpperCase()} used ${
                                value.movement.name
                            } with ${Math.round(value.damage)} and defeated the opponent`
                        );
                    } else {
                        nextText(
                            3,
                            `${player1.pokemons[0].name.toUpperCase()} used ${
                                lastMovement.name
                            } with ${value.damage ? value.damage : 0} of damage`
                        );
                    }
                }
            });
        }
    };

    const turnPlayer2 = async () => {
        dispatch(setWhoGoesFirst("player2"));
        let defeated = false;
        const movementNumber = Math.floor(Math.random() * 4) + 1;
        const damage = await getDamage(
            player2.pokemons[0].moves[movementNumber].move,
            player2.pokemons[0],
            player1.pokemons[0]
        );

        if (damage !== undefined) {
            let pokemons = player1.pokemons;
            let pokemonDamaged = pokemons[0];
            if (player1.pokemons[0].health - damage <= 0) {
                await defeatPokemon(pokemonDamaged.id, "player1");
                await nextText(
                    4,
                    `${player2.pokemons[0].name.toUpperCase()} used ${
                        player2.pokemons[0].moves[movementNumber].move.name
                    } with ${Math.round(damage)} and defeated the opponent`
                );
                defeated = true;
            } else {
                await dispatch(
                    injurePokemonPlayer({
                        name: "player1",
                        id: pokemonDamaged.id,
                        injure: Math.round(damage),
                    })
                );
                await nextText(
                    2,
                    `${player2.pokemons[0].name.toUpperCase()} used ${
                        player2.pokemons[0].moves[movementNumber].move.name
                    } with ${Math.round(damage)}`
                );
                defeated = false;
            }

            return await {
                movement: player2.pokemons[0].moves[movementNumber].move.name,
                damage: Math.round(damage),
                defeated,
            };
        }
    };

    const turnPlayer1 = async (movement: any) => {
        let defeated = false;
        dispatch(setWhoGoesFirst("player1"));
        const damage = await getDamage(movement, player1.pokemons[0], player2.pokemons[0]);
        if (damage !== undefined) {
            let pokemons = player2.pokemons;
            let pokemonDamaged = pokemons[0];
            if (player2.pokemons[0].health - Math.round(damage) <= 0) {
                await defeatPokemon(pokemonDamaged.id, "player2");
                await nextText(
                    4,
                    `${player1.pokemons[0].name.toUpperCase()} used ${
                        movement.name
                    } with ${Math.round(damage)} and defeated the opponent`
                );
                defeated = true;
            } else {
                await dispatch(
                    injurePokemonPlayer({
                        name: "player2",
                        id: pokemonDamaged.id,
                        injure: Math.round(damage),
                    })
                );
                await nextText(
                    2,
                    `${player1.pokemons[0].name.toUpperCase()} used ${
                        movement.name
                    } with ${Math.round(damage)}`
                );
                defeated = false;
            }

            return await { movement: movement.name, damage: Math.round(damage), defeated };
        }
    };

    const defeatPokemon = async (id: number, player: PlayerName) => {
        await dispatch(defeatPokemonsPlayer({ id, name: player }));
        await dispatch(setWhoGoesFirst("player1"));
        await dispatch(updateTurn(1));
        return await true;
    };

    const checkIfThisIsTheLastAlivePokemon = () => {
        if (player1.pokemons.length === 0) {
            dispatch(setWinner({ playerName: "player2" }));
            return true;
        } else if (player2.pokemons.length === 0) {
            dispatch(setWinner({ playerName: "player1" }));
            return true;
        } else return false;
    };

    return {
        init,
        nextText,
        checkIfThisIsTheLastAlivePokemon,
        handleMovementsDisplay,
        handleTeamsDisplay,
        reset,
        battleAction,
        slowerPokemonTurn,
    };
};
