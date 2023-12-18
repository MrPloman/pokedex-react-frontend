import "./ListElement.scss";

interface PokemonElement {
    name: string;
    images: any;
    order: number;
    onClick: any;
}
export const ListElement: React.FC<PokemonElement> = ({ name, images, order, onClick }) => {
    return (
        // <div>
        //     <img src={url.front_default} />
        //     <div>{name}</div>
        // </div>

        <div className="pokeCard" onClick={() => onClick()}>
            <div className="pokeCard-top">
                <div className="pokeCard-top-title">
                    <h3>{order}</h3>
                </div>
            </div>
            <div className="pokeCard-middle">
                <div className="pokeCard-middle-stroke">
                    <div className="pokeCard-middle-stroke-img">
                        {images.front_default ? (
                            <img src={images.front_default} alt="pokemon" />
                        ) : (
                            "?"
                        )}
                    </div>
                </div>
            </div>
            <div className="pokeCard-bottom">
                <h4 className="pokeCard-bottom-title">{name.toUpperCase()}</h4>
            </div>
        </div>
    );
};
