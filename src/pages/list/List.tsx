import { useEffect, useMemo } from "react";
import { PokeApiRequests } from "../../helpers/pokedex-api.helper";
import { ListElement } from "../../components/ListElement/ListElement";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePokemonsList } from "../../hooks/UsePokemonsList";
import { Searchbar } from "../../components/SearchBar/Searchbar";
import "./List.scss";
import axios, { CancelTokenSource } from "axios";
import { Pokemon } from "../../interfaces/PokeApi.interface";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPokemon, setSelectedPokemons } from "../../store/slices/currentPokemon.slice";
import { Navbar } from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

// import {state} from '../../store/store'

export const List = () => {
    const { currentPokemon, selectedPokemons } = useSelector((state: any) => state.pokemonStore);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        pokemonList,
        setPokemonList,
        loading,
        setLoading,
        pagination,
        setPagination,
        hasMoreData,
        setHasMoreData,
        searchInput,
        setSearchInput,
    } = usePokemonsList();
    const { getAllPokemons, getPokemonByName } = PokeApiRequests();

    const getPokemonList = (cancelToken: CancelTokenSource) => {
        setLoading(true);
        getAllPokemons(pagination.limit, pagination.offset, cancelToken).then(async (r: any) => {
            if (r.data.results.length === 0) setHasMoreData(false), setLoading(false);
            if (r.data.results.length === 48) {
                await setPagination({ limit: pagination.limit, offset: pagination.offset + 48 });
            }

            if (r && r.status === 200 && r.data && r.data.results && hasMoreData) {
                const pokemonsCollected = r.data.results;
                if (!pokemonsCollected) {
                    setLoading(false);
                    return;
                }
                await pokemonsCollected.forEach(async (pokemon: any) => {
                    setLoading(true);
                    await getPokemonByName(pokemon.name, cancelToken).then((res: any) => {
                        if (!res.data || res.status !== 200) {
                            setLoading(false);
                            return;
                        }
                        const pok = res.data;
                        setPokemonList((state) => removeDuplicates([...state, pok]));
                    });
                });
                await setPokemonList(sortPokemonList(pokemonList));
                await setLoading(false);
            }
        });
    };
    const searchPokemonByName = (name: string, cancelToken: CancelTokenSource) => {
        if (!name) {
            getPokemonList(cancelToken);
            return;
        }
        setLoading(true);
        getPokemonByName(name.toLocaleLowerCase(), cancelToken).then(async (res: any) => {
            if (!res.data || res.status !== 200) {
                setLoading(false);
                return;
            }
            const pok = res.data;
            await setPokemonList((state) => [...state, pok]);
            setLoading(false);
        });
    };
    const handleInfiniteScroll = () => {
        const cancelToken = axios.CancelToken.source();
        if (!loading && hasMoreData) getPokemonList(cancelToken);
    };
    const removeDuplicates = (list: Pokemon[]): Pokemon[] => {
        const uniquePokemons = list.reduce((accumulator: Pokemon[], current: Pokemon) => {
            if (!accumulator.find((pokemon: Pokemon) => pokemon.id === current.id)) {
                accumulator.push(current);
            }
            return accumulator;
        }, []);
        return uniquePokemons.map((pokemon) => pokemon);
    };
    const sortPokemonList = (list: Pokemon[]): Pokemon[] => {
        return list.sort((a: Pokemon, b: Pokemon) => {
            return a.id - b.id;
        });
    };
    const selectCurrentPokemon = (pokemon: Pokemon) => {
        if (
            selectedPokemons &&
            selectedPokemons.find((selectedPokemon: Pokemon) => selectedPokemon.id === pokemon.id)
        )
            return;
        dispatch(setSelectedPokemons(pokemon));
    };
    const goToPokemonDetail = (pokemon: Pokemon) => {
        // if (currentPokemon && currentPokemon.id === pokemon.id) return;
        // dispatch(setCurrentPokemon(pokemon));
        // console.log(pokemon);
        selectCurrentPokemon(pokemon);
        navigate(`detail`);
    };

    useMemo(() => {
        const cancelToken = axios.CancelToken.source();
        setPokemonList([]);
        setPagination({ limit: 48, offset: 0 });
        searchPokemonByName(searchInput, cancelToken);
    }, [searchInput]);
    return (
        <div className="content">
            <Navbar />
            <div className="content-main">
                <Searchbar searchInput={searchInput} setSearchInput={setSearchInput} />
                <div id="scrollableDiv" className="content-main-results">
                    <InfiniteScroll
                        dataLength={pagination.offset}
                        next={handleInfiniteScroll}
                        hasMore={hasMoreData}
                        loader={loading}
                        height={800}
                        style={{
                            padding: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            gap: "20px",
                        }}
                    >
                        {pokemonList ? (
                            sortPokemonList(pokemonList).map((pokemon: Pokemon, index: number) => {
                                if (pokemon) {
                                    return (
                                        <div key={`selector${pokemon.id}`}>
                                            <ListElement
                                                onClick={() => selectCurrentPokemon(pokemon)}
                                                order={pokemon.id}
                                                images={pokemon.sprites}
                                                name={pokemon.name}
                                                key={index}
                                            />
                                            <div id="buttonsSection">
                                                <Button variant="danger">Danger</Button>{" "}
                                                <button
                                                    key={`goToPokemon${pokemon.id}`}
                                                    onClick={() => goToPokemonDetail(pokemon)}
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    key={`selectPokemon${pokemon.id}`}
                                                    onClick={() => selectCurrentPokemon(pokemon)}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        ) : (
                            <div>NOT FOUND</div>
                        )}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};
