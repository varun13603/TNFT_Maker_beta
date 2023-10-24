import {configureStore} from "@reduxjs/toolkit";
import accountReducer from "./accountSlice";
import newCollectionReducer from "./newCollectionSlice";
import collectioReducer from "./collections";

export default configureStore({
    reducer:{
        account: accountReducer,
        newCollection:newCollectionReducer,
        collection: collectioReducer
    }
})