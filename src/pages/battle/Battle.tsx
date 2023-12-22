import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { UseLogicGame } from "../../hooks/UseLogicGame";
import "./Battle.scss";
import { useNavigate } from "react-router-dom";
import { setActionsDisplay, setLoading } from "../../store/slices/battle.slice";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Button } from "react-bootstrap";
import { PokemonStatus, actionType } from "../../interfaces/LogicGame.interface";

export const Battle = () => {
    const {
        init,
        nextText,
        handleMovementsDisplay,
        handleTeamsDisplay,
        reset,
        battleAction,
        slowerPokemonTurn,
    } = UseLogicGame();

    const { player2, player1, loading, actionsDisplay } = useSelector(
        (state: any) => state.battleStore
    );
    const { selectedPokemons } = useSelector((state: any) => state.pokemonStore);

    const navigate = useNavigate();

    const handleMovementsDisplaySelections = () => {
        if (!actionsDisplay.actions.selected.movements) handleMovementsDisplay(true);
        else handleMovementsDisplay(false);
    };

    const handleTeamsDisplayection = () => {
        if (!actionsDisplay.actions.selected.team) handleTeamsDisplay(true);
        else handleTeamsDisplay(false);
    };

    const handleText = () => {
        if (actionsDisplay.text.status === -1) {
            nextText(actionsDisplay.text.status + 1, "");
        } else if (actionsDisplay.text.status < 2 && actionsDisplay.text.status >= 0) {
            nextText(actionsDisplay.text.status + 1, "");
        } else if (actionsDisplay.text.status === 2) {
            slowerPokemonTurn();
        } else if (actionsDisplay.text.status === 3) {
            nextText(1, "What will you do?");
        }
    };

    const takeDecision = (type: actionType, movement?: any, pokemon?: PokemonStatus) => {
        if (type === "movement") battleAction({ type: "movement", pokemon: undefined, movement });
        if (type === "change") battleAction({ type: "change", pokemon: pokemon });
    };

    useEffect(() => {
        if (selectedPokemons.length === 0) navigate("/");
        else init();
        () => {
            reset();
        };
    }, []);

    return (
        <>
            <div id="page">
                <Navbar />
                <div id="playground">
                    {!!loading ? (
                        <div>...LOADING...</div>
                    ) : (
                        <>
                            <div id="battle">
                                <div className="playerSide" id="playerSide1">
                                    <div className="pokemonStatus" id="pokemon2Status">
                                        <div>{player2.pokemons[0].name}</div>
                                        <ProgressBar
                                            className="hpBar"
                                            now={player2.pokemons[0].health}
                                            variant="danger"
                                        />
                                    </div>
                                    <img src={player1.pokemons[0].sprites.back_default} />
                                </div>
                                <div className="playerSide" id="playerSide2">
                                    <img src={player2.pokemons[0].sprites.front_default} />
                                    <div className="pokemonStatus" id="pokemon1Status">
                                        <div>{player1.pokemons[0].name}</div>
                                        <ProgressBar
                                            className="hpBar"
                                            now={player1.pokemons[0].health}
                                            variant="danger"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div id="textSection">
                                <div id="text">
                                    <p>
                                        {actionsDisplay.text.value ? actionsDisplay.text.value : ""}
                                    </p>
                                    {!actionsDisplay.actions.show ? (
                                        <div>
                                            <Button onClick={() => handleText()}>Next</Button>
                                        </div>
                                    ) : null}
                                </div>
                                {actionsDisplay.actions.show ? (
                                    <>
                                        {!actionsDisplay.actions.selected.movements &&
                                        !actionsDisplay.actions.selected.team ? (
                                            <div id="actions">
                                                <div id="battleActions">
                                                    <Button
                                                        key={`battleButton`}
                                                        onClick={() =>
                                                            handleMovementsDisplaySelections()
                                                        }
                                                        variant="light"
                                                    >
                                                        Movements
                                                    </Button>
                                                </div>

                                                <div id="teamActions">
                                                    <Button
                                                        key={`battleButton`}
                                                        onClick={() => handleTeamsDisplayection()}
                                                        variant="light"
                                                    >
                                                        Team
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : null}
                                        {actionsDisplay.actions.selected.movements ? (
                                            <div id="movementsSelector">
                                                <span
                                                    onClick={() =>
                                                        handleMovementsDisplaySelections()
                                                    }
                                                >
                                                    X
                                                </span>
                                                <ul>
                                                    {player1.pokemons[0].moves.map(
                                                        (type: any, index: number) => {
                                                            if (index < 4) {
                                                                return (
                                                                    <li
                                                                        onClick={() =>
                                                                            takeDecision(
                                                                                "movement",
                                                                                type.move
                                                                            )
                                                                        }
                                                                    >
                                                                        {" "}
                                                                        {type.move.name}
                                                                    </li>
                                                                );
                                                            }
                                                        }
                                                    )}
                                                </ul>
                                            </div>
                                        ) : null}
                                        {actionsDisplay.actions.selected.team ? (
                                            <div id="teamSelector">
                                                <span onClick={() => handleTeamsDisplayection()}>
                                                    X
                                                </span>
                                                <ul>
                                                    {player1.pokemons.map(
                                                        (pokemon: PokemonStatus) => {
                                                            return (
                                                                <li
                                                                    onClick={() =>
                                                                        takeDecision(
                                                                            "change",
                                                                            undefined,
                                                                            pokemon
                                                                        )
                                                                    }
                                                                >
                                                                    {" "}
                                                                    {pokemon.name}
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>
                                            </div>
                                        ) : null}
                                    </>
                                ) : null}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
