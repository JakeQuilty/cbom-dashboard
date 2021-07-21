import { ADD_ORG } from "../constants/action-types"

export function addOrgToList(payload) {
    return { type: ADD_ORG, payload}
}