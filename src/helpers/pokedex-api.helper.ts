import axios, { CancelToken, CancelTokenSource } from "axios";
import { API_VARIABLES } from "../config/api-variables";

export const PokeApiRequests = () => {
    const http = axios;
    const { POKEAPI_URL } = API_VARIABLES;
    const getAllPokemons = async (
        limit: number = 48,
        offset: number = 0,
        cancelToken: CancelTokenSource
    ) => {
        return http.get(`${POKEAPI_URL}?limit=${limit}&offset=${offset}`, {
            cancelToken: cancelToken.token,
        });
    };
    const getPokemonByNumber = async (value: number, cancelToken?: CancelTokenSource) => {
        return http.get(`${POKEAPI_URL}${value}`, {
            cancelToken: cancelToken?.token,
        });
    };
    const getPokemonByName = async (value: string, cancelToken?: CancelTokenSource) => {
        return http.get(`${POKEAPI_URL}${value}`, {
            cancelToken: cancelToken?.token,
        });
    };
    return { getAllPokemons, getPokemonByNumber, getPokemonByName };
};
