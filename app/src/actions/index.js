import {
    ADD_ORG,
    UPDATE_REPOS,
    SIDEBARE_TOGGLE,
    IS_SCANNING_TOGGLE,
    UPDATE_NUM_REPOS
} from "../constants/action-types"

export function addOrgToList(payload) {
    return { type: ADD_ORG, payload}
}

export function updateRepos(payload) {
    return { type: UPDATE_REPOS, payload}
}

export function sideBarToggle(payload) {
    return { type: SIDEBARE_TOGGLE, payload}
}

export function isScanningToggle(payload) {
    return { type: IS_SCANNING_TOGGLE, payload}
}

export function updateNumRepos(payload) {
    return { type: UPDATE_NUM_REPOS, payload}
}