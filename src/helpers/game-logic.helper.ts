import axios from "axios";
import { PokemonStatus } from "../interfaces/LogicGame.interface";

export const GameLogic = () => {
    const http = axios;
    async function getDamage(
        movement: any,
        attackingPokemon: PokemonStatus,
        injuredPokemon: PokemonStatus
    ): Promise<number> {
        console.log(attackingPokemon, injuredPokemon);
        const movementData = await http.get(movement.url).then((movementData: any) => {
            if (movementData.data) return movementData.data;
        });
        console.log(movementData);
        if (!movementData) return await 0;

        return await 0;
    }
    return { getDamage };
};
