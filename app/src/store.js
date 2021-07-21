// import { createStore } from 'redux'

// const initialState = {
//   sidebarShow: 'responsive'
// }

// const changeState = (state = initialState, { type, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return {...state, ...rest }
//     default:
//       return state
//   }
// }

// const store = createStore(changeState)
// export default store

// import { configureStore } from '@reduxjs/toolkit'
// import orgsReducer from './features/orgsSlice'

// export default configureStore({
//   reducer: {
//     orgList: orgsReducer,
//   }
// })

import { createStore } from 'redux'
import rootReducer from './reducers'

const store = createStore(rootReducer)

export default store;