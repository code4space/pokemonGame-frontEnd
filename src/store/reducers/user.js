import { USER } from "../actions/actionType";

const initialState = {
    gacha: null,
    balls: {},
    draw: null
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
        default:
            return state;
    }
}

export default UserReducer