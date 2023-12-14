import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const chatSlice = createSlice(

    {
        name:"chat",
        initialState: null,
        reducers:
        {
            chatFriend:(state,action)=>
            {
                return action.payload;
            },
            


        }
    }
)

export const {chatFriend} = chatSlice.actions;

export default chatSlice.reducer;