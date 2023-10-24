import {createSlice} from "@reduxjs/toolkit";
export const accountSlice = createSlice({
    name: 'account',
    initialState: {
        address:"",
        balance: 0,
        isLoggedIn: false
    },
    reducers:{
        updateAddress: (state, action) => {
            state.address = action.payload;
        },

        updateBalance: (state,action) => {
            state.balance = action.payload
        },

        updateLoginStatus: (state, action) => {
            state.isLoggedIn = action.payload
        }
    }
})

export const {updateAddress, updateBalance, updateLoginStatus} = accountSlice.actions;
export default accountSlice.reducer;