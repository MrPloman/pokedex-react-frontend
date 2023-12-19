import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { useSelector } from "react-redux";
import { Pokemon } from "../../interfaces/PokeApi.interface";
import "./Detail.scss";
import { Navbar } from "../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { PokeApiRequests } from "../../helpers/pokedex-api.helper";

export const Detail = () => {
    const { currentPokemon } = useSelector((state: any) => state.pokemonStore);
    const [descriptionStat, setDescription]: any[] = useState(undefined);
    const getDescription = async () => {
        const { getPokemonCharacteristic } = PokeApiRequests();
        setDescription(await (await getPokemonCharacteristic(currentPokemon.id)).data);
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
                                    style={{ padding: "30px", alignContent: "center" }}
                                >
                                    {currentPokemon.name}
                                </Col>
                            </Row>

                            <Row>
                                {currentPokemon.types.map((type: any) => (
                                    <Col
                                        xs={6}
                                        md={6}
                                        lg={6}
                                        style={{ padding: "30px", alignContent: "center" }}
                                    >
                                        <span>Type</span>
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
                                        <p>{descriptionStat?.flavor_text_entries[0].flavor_text}</p>
                                    ) : (
                                        <div>LOADING</div>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                {currentPokemon.stats.map((stat: any) => (
                                    <Col
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
                            <Row>
                                <Image
                                    style={{ width: "90%" }}
                                    src={currentPokemon.sprites.front_default}
                                ></Image>
                            </Row>{" "}
                            <Row>
                                <Col xs={6} md={6} lg={6}>
                                    <Button variant="danger">Add</Button>
                                </Col>
                                <Col xs={6} md={6} lg={6}>
                                    <Button variant="light">Remove</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        {currentPokemon.moves.map((type: any, index: number) => {
                            if (index < 12) {
                                return (
                                    <Col xs={4} md={4} lg={4}>
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
