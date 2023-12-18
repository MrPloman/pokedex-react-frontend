import React, { useState } from "react";
import "./Navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { Pokemon } from "../../interfaces/PokeApi.interface";
import {
    removeSelectedPokemon,
    setSelectedPokemons,
} from "../../store/slices/currentPokemon.slice";

export const Navbar = () => {
    const { selectedPokemons } = useSelector((state: any) => state.pokemonStore);
    const dispatch = useDispatch();

    const [style, setStyle] = useState({ display: "none" });

    return (
        <div>
            <nav className="navMenu">
                <a href="#">Home</a>

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
                        <div className="pokemon" key={pokeball.id} id={pokeball.name}>
                            <img src={pokeball.sprites.front_default} alt={pokeball.name} />
                            <span className="pokeName">{pokeball.name}</span>
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
