import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { UseLogicGame } from "../../hooks/UseLogicGame";
import "./Battle.scss";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../store/slices/battle.slice";
import ProgressBar from "react-bootstrap/ProgressBar";

export const Battle = () => {
    const { player2, player1, loading } = useSelector((state: any) => state.battleStore);
    const { selectedPokemons } = useSelector((state: any) => state.pokemonStore);
    const navigate = useNavigate();

    const { init } = UseLogicGame();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedPokemons.length === 0) navigate("/");
        else {
            init();
        }
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

                                        <ProgressBar className="hpBar" now={60} variant="danger" />
                                    </div>
                                    <img src={player1.pokemons[0].sprites.back_default} />
                                </div>
                                <div className="playerSide" id="playerSide2">
                                    <img src={player2.pokemons[0].sprites.front_default} />
                                    <div className="pokemonStatus" id="pokemon1Status">
                                        <div>{player1.pokemons[0].name}</div>
                                        <ProgressBar className="hpBar" now={60} variant="danger" />
                                    </div>
                                </div>
                            </div>
                            <div id="textSection"></div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
