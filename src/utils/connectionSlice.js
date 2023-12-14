import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const connectionSlice = createSlice(

    {
        name:"connection",
        initialState:   {
            connection: null
        },
        reducers:
        {
            addConnection:(state,action)=>
            {
             state.connection = action.payload;
            }
          

        }
    }
)

export const {addConnection} = connectionSlice.actions;

export default connectionSlice.reducer;