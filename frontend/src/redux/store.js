import { createStore } from 'redux'
import { combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'


//reducers
import userReducer from './userReducer'
import cartReducer from './CartReducer'


const rootReducer  = combineReducers({
    user: userReducer,
    cart: cartReducer
})

const store = createStore(rootReducer,composeWithDevTools())

export default store