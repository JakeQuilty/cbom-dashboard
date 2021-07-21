import { createSlice } from '@reduxjs/toolkit'

export const orgsSlice = createSlice({
    name: 'orgList',
    initialState: {
        value: [{
            id: 351234,
            name: 'Protonmail',
            numRepos: 154,
            numDeps: 81354,
            avatar: 'https://avatars.githubusercontent.com/u/6953970?s=200&v=4'
        },
        {
            id: 12353,
            name: 'SignalApp',
            numRepos: 93,
            numDeps: 21354,
            avatar: 'https://avatars.githubusercontent.com/u/702459?s=200&v=4'
        },
        {
            id: 312523,
            name: 'DuckDuckGo',
            numRepos: 89,
            numDeps: 3541,
            avatar: 'https://avatars.githubusercontent.com/u/342708?s=200&v=4'
        },
        {
          id: 4654643,
          name: 'TorProject',
          numRepos: '-',
          numDeps: '-',
          avatar: 'https://avatars.githubusercontent.com/u/4099049?s=200&v=4'
      }],
    },
    reducers: {
        addToOrgList: (state, org) => {
            if (org.payload.numRepos === undefined) org.payload.numRepos = '-';
            if (org.payload.numDeps === undefined) org.payload.numDeps = '-'
            // base64 decode
            org.payload.avatar = atob(org.payload.avatar)


            // check for id in orgList


            console.log('addOrg: ', org.payload)
            //state = [...state.value, org.payload]
            state.concat(org.payload)
            console.log('state', state)
        },
        deleteFromOrgList: (state, action) => {

        }
    }
})

export const { addToOrgList, deleteFromOrgList } = orgsSlice.actions

export default orgsSlice.reducer