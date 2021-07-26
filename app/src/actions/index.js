import {
    ADD_ORG,
    UPDATE_REPOS,
    SIDEBARE_TOGGLE,
    IS_SCANNING_TOGGLE,
    UPDATE_NUM_REPOS,
    UPDATE_REPO_DEPS,
    UPDATE_DEPS,
    UPDATE_NUM_DEPS,
    UPDATE_DEP_REPOS
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

export function updateRepoDeps(payload) {
    return { type: UPDATE_REPO_DEPS, payload}
}

export function updateDeps(payload) {
    return { type: UPDATE_DEPS, payload }
}

export function updateNumDeps(payload) {
    return { type: UPDATE_NUM_DEPS, payload}
}

export function updateDepRepos(payload) {
    return { type: UPDATE_DEP_REPOS, payload }
}