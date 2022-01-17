const USER_LOGIN = 'USER_LOGIN'
const USER_LOGOUT = 'USER_LOGOUT'
const CHECKOUT_IN = 'CHECKOUT_IN'
const CHECKOUT_OUT = 'CHECKOUT_OUT'

export const userLogin = (status,token) => {
    return{
        type: USER_LOGIN,
        payload: {"token":token,"status":status}
    } 
}

export const userLogout = () => {
    return {
        type: USER_LOGOUT
    }
}

export const redirectCheckout = () => {
    return {
        type: CHECKOUT_IN
    }
}

export const closeCheckout = () =>{
    return{
        type:CHECKOUT_OUT
    }
}

const initialValue = {
    status:'NOT_LOGGED',
    token:'',
    checkout:false
}

const userReducer = ( state = initialValue, action) =>{
    switch(action.type){
        case USER_LOGIN: return{
            ...state,status:action.payload.status,token:action.payload.token
        }

        case USER_LOGOUT: return state = initialValue

        case CHECKOUT_IN: return{
            ...state, checkout:true
        }

        case CHECKOUT_OUT: return{
            ...state, checkout:false
        }
        
        default: return state
    }
}

export default userReducer