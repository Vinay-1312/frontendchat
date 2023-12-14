import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const addSlice = createSlice(

    {
        name:"add",
        initialState: {
            showAdd:false,
            
        },
        reducers:
        {
            toggleAdd:(state,action)=>
            {
                state.showAdd = !state.showAdd
            },
           
            


        }
    }
)

export const {toggleAdd} = addSlice.actions;

export default addSlice.reducer;