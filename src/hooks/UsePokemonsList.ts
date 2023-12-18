import { useRef, useState } from "react";
import { Pokemon } from "../interfaces/PokeApi.interface";

export const usePokemonsList = () => {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [pagination, setPagination] = useState<{ offset: number; limit: number }>({
        limit: 48,
        offset: 0,
    });
    const [searchInput, setSearchInput] = useState("");
    const [hasMoreData, setHasMoreData] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    return {
        pokemonList,
        setPokemonList,
        pagination,
        setPagination,
        loading,
        setLoading,
        hasMoreData,
        setHasMoreData,
        searchInput,
        setSearchInput,
    };
};
