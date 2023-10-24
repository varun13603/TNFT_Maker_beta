import {createSlice} from "@reduxjs/toolkit";
export const collectionSlice = createSlice({
    name: 'collection',
    initialState: {
        allCollections:[],
        myCollections: [],
        selectedCollection: {data:{
            isDeployed: false
        }}
    },
    reducers:{
        setAllCollection: (state, action) => {
            state.allCollections = action.payload;
        },

        setMyCollection: (state,action) => {
            state.myCollections = action.payload
        },

        setSelectedCollection: (state, action) => {
            state.selectedCollection = action.payload
        }
    }
})

export const {setAllCollection, setMyCollection, setSelectedCollection} = collectionSlice.actions;
export default collectionSlice.reducer;