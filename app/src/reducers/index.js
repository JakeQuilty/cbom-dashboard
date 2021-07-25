import {
    ADD_ORG,
    UPDATE_NUM_REPOS,
    UPDATE_NUM_DEPS,
    UPDATE_REPOS,
    SIDEBARE_TOGGLE,
    IS_SCANNING_TOGGLE,
    UPDATE_REPO_DEPS,
    UPDATE_DEPS
} from "../constants/action-types"

const initialState = {
    orgList: [],
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

        case UPDATE_NUM_DEPS:
            let updateNumDeps = state.orgList
            for (const org of updateNumDeps) {
                if (org.id === action.payload.id) {
                    org.numDeps = action.payload.numDeps
                }
            }
            return {
                ...state,
                orgList: updateNumDeps
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
        
        case UPDATE_REPO_DEPS:
            let updateRepoDeps = state.orgList
            // gross
            for (const org of updateRepoDeps) {
                if (org.id === action.payload.orgID) {
                    for (const repo of org.repos) {
                        if (repo.id === action.payload.repoID) {
                            repo.deps = action.payload.deps
                        }
                    }
                }
            }
            return {
                ...state,
                orgList: updateRepoDeps
            }

        case UPDATE_DEPS:
            let updateDeps = state.orgList
            for (const org of updateDeps) {
                if (org.id === action.payload.id) {
                    org.deps = action.payload.deps
                }
            }
            return {
                ...state,
                orgList: updateDeps
            }


        default:
            return state
        }
}

export default rootReducer