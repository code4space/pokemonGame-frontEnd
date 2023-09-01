import { SET_BATTLE_DECK, SET_DECK_TO_EMPTY, SET_IS_HARD } from "./actionType"


export const setIsHard = (isHard) => {
    return { type: SET_IS_HARD, isHard }
}

export const storeMyDeck = (myDeck) => {
    return { type: SET_BATTLE_DECK, myDeck }
}

export const emptyingTheDeck = () => {
    return { type: SET_DECK_TO_EMPTY }
}