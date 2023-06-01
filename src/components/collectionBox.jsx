import { setColor } from "../constant/helper"

export default function CollectionBox({ pokemon, handleButtonDetail, deck = false }) {
    function fillEmptyDeck() {
        let manyEmptyDeck = 3 - pokemon.length
        let arr = []
        for (let i = manyEmptyDeck; i > 0; i--) {
            arr.push(i)
        }
        return (
            arr.map((el, i) => {
                return (
                    <div className="item-collection" key={i}>
                        <div className="shining-animation"></div>
                        <span>{el}</span>
                    </div>
                )
            })
        )
    }
    return (
        <div className={deck ? "box-collection deck-box" : "box-collection"}>
            {pokemon.map((el, i) => {
                return (
                    <div key={i} className="item-collection" style={el.baseExp > 307 ? { animationName: 'glow', animationDuration: '2s', animationDelay: '1s', animationIterationCount: 'infinite', backgroundColor: setColor(el.baseExp) } : { backgroundColor: setColor(el.baseExp) }} onClick={() => handleButtonDetail(i, deck)}>
                        {(el.baseExp > 219 && el.baseExp < 308) && <div className="shining-animation"></div>}
                        <img src={el.img1} alt="pokemon_img" />
                    </div>
                )
            })}
            {(pokemon.length < 3 && deck) ?
                fillEmptyDeck()
                : null}
        </div>
    )
}