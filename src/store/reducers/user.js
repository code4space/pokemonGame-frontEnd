import { SET_IS_HARD, USER, SET_BATTLE_DECK } from "../actions/actionType";

const initialState = {
    gacha: null,
    balls: {},
    draw: null,
    isHard: false,
    deck: []
}

function UserReducer (state = initialState, action) {
    switch (action.type) {
        case USER:
            return {
                ...state,
                gacha: action.payload.gacha,
                balls: action.payload.balls,
                draw: action.payload.draw
            }
        case SET_IS_HARD: 
            return {
                ...state,
                isHard: action.isHard
            }
        case SET_BATTLE_DECK: 
            return {
                ...state,
                isHard: action.isHard
            }
        default:
            return state;
    }
}

export default UserReducer