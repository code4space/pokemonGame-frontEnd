import { SET_IS_HARD, USER, SET_BATTLE_DECK, SET_DECK_TO_EMPTY } from "../actions/actionType";

const initialState = {
    username: '',
    gacha: null,
    balls: {},
    draw: null,
    isHard: false,
    deck: []
}

function UserReducer(state = initialState, action) {
    switch (action.type) {
        case USER:
            return {
                ...state,
                gacha: action.payload.gacha,
                balls: action.payload.balls,
                draw: action.payload.draw,
                username: action.payload.username,
            }
        case SET_IS_HARD:
            return {
                ...state,
                isHard: action.isHard
            }
        case SET_BATTLE_DECK:
            return {
                ...state,
                deck: action.payload
            }
        case SET_DECK_TO_EMPTY:
            return {
                ...state,
                deck: []
            }
        default:
            return state;
    }
}

export default UserReducer