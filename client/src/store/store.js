import {configureStore} from "@reduxjs/toolkit"
import uiSlice from "./ui-slice"
import voteSlice from "./vote-slice";



var store=configureStore({
    reducer:{ui:uiSlice.reducer,vote:voteSlice.reducer}
})

export default store;