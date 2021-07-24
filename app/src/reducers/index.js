import {
    ADD_ORG,
    UPDATE_NUM_REPOS,
    UPDATE_NUM_DEPS,
    UPDATE_REPOS,
    SIDEBARE_TOGGLE,
    IS_SCANNING_TOGGLE
} from "../constants/action-types"

const initialState = {
    orgList: [{
        id: 351234,
        name: 'Protonmail',
        numRepos: 154,
        numDeps: 81354,
        avatar: 'https://avatars.githubusercontent.com/u/6953970?s=200&v=4',
        isScanning: false,
        repos: [
            {
                id: 1,
                name: 'protonmail'
            },
            {
                id: 2,
                name: 'protonvpn'
            }
        ]
    },
    {
        id: 12353,
        name: 'SignalApp',
        numRepos: 93,
        numDeps: 21354,
        avatar: 'https://avatars.githubusercontent.com/u/702459?s=200&v=4',
        isScanning: false,
        repos: [
            {
                id: 1,
                name: 'signal-ios'
            },
            {
                id: 2,
                name: 'signal-android'
            }
        ]
    },
    {
        id: 312523,
        name: 'DuckDuckGo',
        numRepos: 89,
        numDeps: 3541,
        avatar: 'https://avatars.githubusercontent.com/u/342708?s=200&v=4',
        isScanning: false,
        repos: [
            {
                id: 1,
                name: 'duckduckgo'
            }
        ]
    },
    {
      id: 4654643,
      name: 'TorProject',
      numRepos: '-',
      numDeps: '-',
      avatar: 'https://avatars.githubusercontent.com/u/4099049?s=200&v=4',
      isScanning: false,
      repos: []
  }],
  sidebarShow: 'responsive'
}
function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_ORG:
            // only add to list if doesn't already exist
            for (const org of state.orgList) {
                if (org.id === action.payload.id) {
                    return {
                        ...state,
                        orgList: [...state.orgList]
                    }
                }
            }
            return {
                ...state,
                orgList: [...state.orgList, action.payload]
            }
        
        case UPDATE_REPOS:
            let updateRepos = state.orgList
            for (const org of updateRepos) {
                if (org.id === action.payload.id) {
                    org.repos = action.payload.repos
                }
            }
            return {
                ...state,
                orgList: updateRepos
            }

        case UPDATE_NUM_REPOS:
            let updateNumRepos = state.orgList
            for (const org of updateNumRepos) {
                if (org.id === action.payload.id) {
                    org.numRepos = action.payload.numRepos
                }
            }
            return {
                ...state,
                orgList: updateNumRepos
            }

        case SIDEBARE_TOGGLE:
            return {
                ...state,
                sidebarShow: action.payload
            }

        case IS_SCANNING_TOGGLE:
            let updateIsScanning = state.orgList
            for (const org of updateIsScanning) {
                if (org.id === action.payload.id) {
                    org.isScanning = action.payload.isScanning
                }
            }
            return {
                ...state,
                orgList: updateIsScanning
            }


        default:
            return state
        }
}

export default rootReducer