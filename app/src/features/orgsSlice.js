import { createSlice } from '@reduxjs/toolkit'

export const orgsSlice = createSlice({
    name: 'orgsList',
    initialState: {
        value: [],
    },
    reducers: {
        addToOrgList: (state) => {
            //state.value 
        },
        deleteFromOrgList: (state, action) => {

        }
    }
})

export const { addToOrgList, deleteFromOrgList } = orgsSlice.actions

export default orgsSlice.reducer