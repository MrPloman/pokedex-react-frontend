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
} from "../store/slices/battle.slice";
import { GameLogic } from "../helpers/game-logic.helper";

export const UseLogicGame = () => {
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

    const nextText = (num: number, message: string) => {
        let actions = {
            show: false,
            selected: { movements: false, team: false },
        };
        let text = "";
        if (num === -2) {
            text = message;
        }
        if (num === -1) {
            text = message;
        }
        if (num === 0) text = message ? message : `Player2 chooses ${player2.pokemons[0].name}`;
        if (num === 1) {
            text = message ? message : "What will you do?";
            actions.show = true;
        }
        if (num === 2) {
            text = message && message;
            actions.show = false;
            actions.selected.movements = false;
            actions.selected.team = false;
        }
        if (num === 3) {
            text = message && message;
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
        for (let index = 0; index < 6; index++) {
            const number = Math.floor(Math.random() * 1000) + 1;
            const pokemon = await getPokemonByNumber(number, cancelToken);
            pokemons = [...pokemons, { ...pokemon.data, health: 100, defeated: false }];
        }
        return await pokemons;
    };

    const battleAction = async (action: {
        type: actionType;
        pokemon?: PokemonStatus;
        movement?: any;
    }) => {
        if (!action || !action.type) return;
        switch (action.type) {
            case "movement":
                dispatch(setProcessing({ processing: true }));
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
                if (value) {
                    if (checkIfThisIsTheLastAlivePokemon("player1")) {
                        nextText(-2, `Game finished, player1 is defeated`);
                    } else {
                        nextText(
                            3,
                            `${player2.pokemons[0].name} used ${value.movement} with ${
                                value.damage ? value.damage : 0
                            } of damage`
                        );
                    }
                }
            });
        } else {
            dispatch(setWhoGoesFirst("player1"));

            turnPlayer1(lastMovement).then((value: any) => {
                if (value) {
                    if (checkIfThisIsTheLastAlivePokemon("player2")) {
                        nextText(-2, `Game finished, player1 is defeated`);
                    } else {
                        nextText(
                            3,
                            `${player1.pokemons[0].name} used ${lastMovement.name} with ${
                                value.damage ? value.damage : 0
                            } of damage`
                        );
                    }
                }
            });
        }
    };

    const turnPlayer2 = async () => {
        dispatch(setWhoGoesFirst("player2"));
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
                defeatPokemon(player1.pokemons[0].id, "player1");
            } else {
                dispatch(
                    injurePokemonPlayer({
                        name: "player1",
                        id: pokemonDamaged.id,
                        injure: Math.round(damage),
                    })
                );
                if (checkIfThisIsTheLastAlivePokemon("player1")) {
                    nextText(-2, `Game finished, player1 is defeated`);
                } else {
                    nextText(
                        2,
                        `${player2.pokemons[0].name} used ${
                            player2.pokemons[0].moves[movementNumber].move.name
                        } with ${Math.round(damage)}`
                    );
                }
            }

            return await {
                movement: player2.pokemons[0].moves[movementNumber].move.name,
                damage: Math.round(damage),
            };
        }
    };

    const turnPlayer1 = async (movement: any) => {
        dispatch(setWhoGoesFirst("player1"));
        const damage = await getDamage(movement, player1.pokemons[0], player2.pokemons[0]);
        if (damage !== undefined) {
            let pokemons = player2.pokemons;
            let pokemonDamaged = pokemons[0];
            if (player2.pokemons[0].health - Math.round(damage) <= 0) {
                defeatPokemon(player2.pokemons[0].id, "player2");
            } else {
                dispatch(
                    injurePokemonPlayer({
                        name: "player2",
                        id: pokemonDamaged.id,
                        injure: Math.round(damage),
                    })
                );
                if (checkIfThisIsTheLastAlivePokemon("player1")) {
                    nextText(-2, `Game finished, player2 is defeated`);
                } else {
                    nextText(
                        2,
                        `${player1.pokemons[0].name} used ${movement.name} with ${Math.round(
                            damage
                        )}`
                    );
                }
            }
            return await { movement: movement.name, damage: Math.round(damage) };
        }
    };

    const defeatPokemon = (id: number, player: PlayerName) => {
        dispatch(defeatPokemonsPlayer({ id, name: player }));

        if (player === "player1") {
            nextText(-1, `${player1.pokemons[0].name} defeated`);

            handleTeamsDisplay(true);
        } else if (player === "player2") nextText(-1, `${player2.pokemons[0].name} defeated`);
        dispatch(setWhoGoesFirst("player1"));
        dispatch(updateTurn(1));
        // } else {
        //     nextText(-1, `Game finished, ${player} is defeated`);
        // }
    };

    const checkIfThisIsTheLastAlivePokemon = (playerName: PlayerName) => {
        if (
            (playerName === "player1" && player1.pokemons.length === 0) ||
            (playerName === "player2" && player2.pokemons.length === 0)
        ) {
            dispatch(setWinner({ playerName }));
            return true;
        } else {
            return false;
        }
    };

    return {
        init,
        nextText,
        handleMovementsDisplay,
        handleTeamsDisplay,
        reset,
        battleAction,
        slowerPokemonTurn,
    };
};
