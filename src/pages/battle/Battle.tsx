import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { UseLogicGame } from "../../hooks/UseLogicGame";
import "./Battle.scss";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../store/slices/battle.slice";

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
            <div>
                <Navbar />
                <div id="playground">
                    {!!loading ? (
                        <div>...LOADING...</div>
                    ) : (
                        <div id="battle">
                            <div className="playerSide" id="playerSide1">
                                <img src={player1.pokemons[0].sprites.back_default} />
                            </div>
                            <div className="playerSide" id="playerSide2">
                                <img src={player2.pokemons[0].sprites.front_default} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
