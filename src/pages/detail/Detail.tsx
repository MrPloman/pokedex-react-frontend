import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { useDispatch, useSelector } from "react-redux";
import { Pokemon } from "../../interfaces/PokeApi.interface";
import "./Detail.scss";
import { Navbar } from "../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { PokeApiRequests } from "../../helpers/pokedex-api.helper";
import {
    removeSelectedPokemon,
    setSelectedPokemons,
} from "../../store/slices/currentPokemon.slice";

export const Detail = () => {
    const { currentPokemon, selectedPokemons } = useSelector((state: any) => state.pokemonStore);
    const [descriptionStat, setDescription]: any[] = useState(undefined);
    const dispatch = useDispatch();

    const getDescription = async () => {
        const { getPokemonCharacteristic } = PokeApiRequests();
        setDescription(await (await getPokemonCharacteristic(currentPokemon.id)).data);
    };
    const addPokemonToYourTeam = (pokemon: Pokemon) => {
        if (
            selectedPokemons &&
            selectedPokemons.find((selectedPokemon: Pokemon) => selectedPokemon.id === pokemon.id)
        )
            return;
        dispatch(setSelectedPokemons(pokemon));
    };
    const removePokemonFromYourTeam = (pokemon: Pokemon) => {
        if (
            selectedPokemons &&
            selectedPokemons.find((selectedPokemon: Pokemon) => selectedPokemon.id === pokemon.id)
        )
            dispatch(removeSelectedPokemon(pokemon));
    };
    useEffect(() => {
        if (currentPokemon && currentPokemon.id) {
            getDescription();
        }
    }, []);

    return (
        <div>
            <Navbar />
            {currentPokemon ? (
                <Container>
                    <Row>
                        <Col xs={6} md={6} lg={6}>
                            <Row>
                                <Col
                                    xs={12}
                                    md={12}
                                    lg={12}
                                    style={{
                                        padding: "30px",
                                        alignContent: "center",
                                        marginTop: "150px",
                                    }}
                                >
                                    {currentPokemon.name}
                                </Col>
                            </Row>

                            <Row>
                                {currentPokemon.types.map((type: any, index: number) => (
                                    <Col
                                        key={index}
                                        xs={6}
                                        md={6}
                                        lg={6}
                                        style={{ padding: "30px", alignContent: "center" }}
                                    >
                                        <span>Type </span>
                                        {type.slot} : {type.type.name}
                                    </Col>
                                ))}
                            </Row>
                            <Row>
                                <Col
                                    xs={12}
                                    md={12}
                                    lg={12}
                                    style={{ padding: "30px", alignContent: "center" }}
                                >
                                    {!!descriptionStat ? (
                                        <p>
                                            {descriptionStat?.flavor_text_entries[0].flavor_text}.{" "}
                                            {descriptionStat?.flavor_text_entries[2].flavor_text}{" "}
                                            {descriptionStat?.flavor_text_entries[3].flavor_text}
                                        </p>
                                    ) : (
                                        <div>LOADING</div>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                {currentPokemon.stats.map((stat: any, index: any) => (
                                    <Col
                                        key={index}
                                        xs={4}
                                        md={4}
                                        lg={4}
                                        style={{ padding: "30px", alignContent: "center" }}
                                    >
                                        {stat.stat.name} : {stat.base_stat}
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                        <Col xs={6} md={6} lg={6}>
                            <Row
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "100px",
                                }}
                            >
                                <Image
                                    style={{ width: "70%" }}
                                    src={currentPokemon.sprites.front_default}
                                ></Image>
                            </Row>{" "}
                            <Row>
                                <Col
                                    xs={6}
                                    md={6}
                                    lg={6}
                                    style={{ display: "flex", justifyContent: "center" }}
                                >
                                    <Button
                                        disabled={selectedPokemons.find(
                                            (selectedPokemon: Pokemon) =>
                                                selectedPokemon.id === currentPokemon.id
                                        )}
                                        onClick={() => addPokemonToYourTeam(currentPokemon)}
                                        variant="danger"
                                    >
                                        Add
                                    </Button>
                                </Col>
                                <Col
                                    xs={6}
                                    md={6}
                                    lg={6}
                                    style={{ display: "flex", justifyContent: "center" }}
                                >
                                    <Button
                                        disabled={
                                            !selectedPokemons.find(
                                                (selectedPokemon: Pokemon) =>
                                                    selectedPokemon.id === currentPokemon.id
                                            )
                                        }
                                        onClick={() => removePokemonFromYourTeam(currentPokemon)}
                                        variant="light"
                                    >
                                        Remove
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        {currentPokemon.moves.map((type: any, index: number) => {
                            if (index < 12) {
                                return (
                                    <Col
                                        key={index}
                                        style={{ padding: "30px", alignContent: "center" }}
                                        xs={3}
                                        md={3}
                                        lg={3}
                                    >
                                        Move{index + 1}: {type.move.name}
                                    </Col>
                                );
                            }
                        })}
                    </Row>
                </Container>
            ) : (
                <div>NO POKEMON SELECTED</div>
            )}
        </div>
    );
};
