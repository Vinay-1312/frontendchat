import Login from "./Login"
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import MainPage from "./MainPage";
import AddFriend from "./AddFriend";
import FriendRequest from "./FriendRequest";
import Chat from "./Chat";
const Body  = () =>
{
    const appRouter = createBrowserRouter(
        [{
            path:"/",
            element: <Login />
        },
        {
            path:"/main",
            element:<MainPage />
        },
        {
            path:"/add",
            element:<AddFriend />
        },
        {
            path:"/friend",
            element:<FriendRequest />
        },
        {
            path:"/chat/:chatid",
            element:<Chat />
        },


    ]);
    return (
        <div>
            
            <RouterProvider router={appRouter} />

        </div>
    )
}

export default Body;