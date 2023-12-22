import axios from "axios";
import { PokemonStatus, PokemonTypes } from "../interfaces/LogicGame.interface";
import { API_VARIABLES } from "../config/api-variables";
import { Type } from "../interfaces/PokeApi.interface";

export const GameLogic = () => {
    const { POKEAPI_URL } = API_VARIABLES;
    const http = axios;
    const getTypePonderation = async (movementType: PokemonTypes, pokemonType: PokemonTypes) => {
        const ponderations = (await http.get(`${API_VARIABLES.POKEAPI_URL}type/${movementType}`))
            .data;
        if (!ponderations) return;
        let damagePonderation = 1;
        if (ponderations.damage_relations) {
            const { no_damage_to, half_damage_to, double_damage_to } =
                ponderations.damage_relations;
            if (
                no_damage_to &&
                no_damage_to.length > 0 &&
                no_damage_to.find(
                    (typeFound: { name: PokemonTypes; url: string }) =>
                        typeFound.name === pokemonType
                )
            ) {
                damagePonderation = 0;
            }
            if (
                half_damage_to &&
                half_damage_to.length > 0 &&
                half_damage_to.find(
                    (typeFound: { name: PokemonTypes; url: string }) =>
                        typeFound.name === pokemonType
                )
            ) {
                damagePonderation = 0.5;
            }
            if (
                double_damage_to &&
                double_damage_to.length > 0 &&
                double_damage_to.find(
                    (typeFound: { name: PokemonTypes; url: string }) =>
                        typeFound.name === pokemonType
                )
            ) {
                damagePonderation = 2;
            }
        }
        return await damagePonderation;
        // for (const damageKey in ponderations.damage_relations) {
        //     let damage: number = 1;

        //     ponderations.damage_relations[damageKey].forEach((element: Type) => {
        //         console.log(damageKey, element);
        //         if (element === pokemonType) {
        //             if (damageKey === "no_damage_to") damage = 0;
        //             if (damageKey === "half_damage_to") damage = 0.5;
        //             if (damageKey === "double_damage_to") damage = 2;
        //         }
        //         console.log(damage);
        //     });
        // }
    };
    async function getDamage(
        movement: { url: string },
        attackingPokemon: PokemonStatus,
        injuredPokemon: PokemonStatus
    ): Promise<number> {
        const movementData = await (await http.get(movement.url)).data;
        if (!movementData || !attackingPokemon) return await 0;
        const ponderation = await getTypePonderation(
            movementData.type.name,
            injuredPokemon.types[0].type.name
        );
        const { stats } = attackingPokemon;
        const statsInjured = injuredPokemon.stats;

        const defense =
            statsInjured.length > 0 &&
            statsInjured.find((statElement) => statElement.stat.name === "defense")
                ? statsInjured.find((statElement) => statElement.stat.name === "defense")?.base_stat
                : 1;
        const attack =
            stats.length > 0 && stats.find((statElement) => statElement.stat.name === "attack")
                ? stats.find((statElement) => statElement.stat.name === "attack")?.base_stat
                : 1;
        if (ponderation && attack && defense && movementData) {
            const damageFinalResult: number =
                ((ponderation * (movementData.power / 100) * attack) / defense) * 25;
            return await damageFinalResult;
        } else return await 0;
    }
    return { getDamage };
};
