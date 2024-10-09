import { LOGIN_USER, LOGOUT_USER } from '../constants/userConstants'

// const initialState = {
//     userInfo:{}
// }
export const userRegisterLoginReducer = (state = {}, action) => {
    // console.log('Payload received in reducer:', action.payload);//getting payload of userInfo
    switch (action.type) {
        case LOGIN_USER:
           return {
               ...state,
               userInfo: action.payload
           } 
        case LOGOUT_USER:
            return {};
        default:
            return state
    }
}
