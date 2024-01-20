import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { Pokemon } from "../../interfaces/PokeApi.interface";
import {
    removeSelectedPokemon,
    setCurrentPokemon,
    setSelectedPokemons,
} from "../../store/slices/currentPokemon.slice";
import { useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    const { selectedPokemons, currentPokemon } = useSelector((state: any) => state.pokemonStore);
    const dispatch = useDispatch();
    const location = useLocation();

    const [style, setStyle] = useState({ display: "none" });
    const selectCurrentPokemon = (pokemon: Pokemon) => {
        if (currentPokemon && currentPokemon.id === pokemon.id) return;
        dispatch(setCurrentPokemon(pokemon));
    };
    const goToPokemonDetail = (pokemon: Pokemon) => {
        // if (currentPokemon && currentPokemon.id === pokemon.id) return;
        // dispatch(setCurrentPokemon(pokemon));
        // console.log(pokemon);
        selectCurrentPokemon(pokemon);
        if (location.pathname !== "/detail") navigate(`detail`);
    };
    useEffect(() => {
        if (!currentPokemon) navigate("/");
    }, []);

    return (
        <div>
            <nav className="navMenu">
                <div id="leftSide">
                    {" "}
                    <a onClick={() => navigate(`/`)}>Home</a>
                    {selectedPokemons.length > 0 ? (
                        <a onClick={() => navigate(`/battle`)}>Fight</a>
                    ) : null}
                </div>

                {location.pathname !== "/battle" ? (
                    <div
                        id="pokeballSection"
                        onMouseEnter={() => {
                            setStyle({ display: "block" });
                        }}
                        onMouseLeave={() => {
                            setStyle({ display: "none" });
                        }}
                    >
                        {" "}
                        <span id="numberOfPokemonSelected">{selectedPokemons.length}</span>
                        <div className="pokeball"></div>
                    </div>
                ) : null}
            </nav>
            <div
                id="selectedPokemonsDisplay"
                style={style}
                onMouseEnter={() => {
                    setStyle({ display: "block" });
                }}
                onMouseLeave={() => {
                    setStyle({ display: "none" });
                }}
            >
                {selectedPokemons.map((pokeball: Pokemon) => {
                    return (
                        <div
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                goToPokemonDetail(pokeball);
                            }}
                            className="pokemon"
                            key={pokeball.id}
                            id={pokeball.name}
                        >
                            <img src={pokeball.sprites.front_default} alt={pokeball.name} />
                            <span className="pokeName">{pokeball.name.toUpperCase()}</span>
                            <span
                                onClick={() => dispatch(removeSelectedPokemon(pokeball))}
                                style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: "white",
                                    marginLeft: "20px",
                                }}
                            >
                                X
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
