import { ADD_ORG, UPDATE_REPOS, SIDEBARE_TOGGLE } from "../constants/action-types"

export function addOrgToList(payload) {
    return { type: ADD_ORG, payload}
}

export function updateRepos(payload) {
    return { type: UPDATE_REPOS, payload}
}

export function sideBarToggle(payload) {
    return { type: SIDEBARE_TOGGLE, payload}
}