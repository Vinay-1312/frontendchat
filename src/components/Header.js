import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Logo, supportedLanguage } from "../utils/constant";
import { URL } from "./constant";
import { HubConnectionBuilder } from "@microsoft/signalr";
const Header = () =>
{

    const user = useSelector((store)=>store.user);
    const navigate = useNavigate()
    const dispatchAdduser = useDispatch(addUser);
    const dispatch = useDispatch();
  
    const dispatchRemoveuser = useDispatch(removeUser);
 
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            const {uid,email,displayName} = user;
            
            dispatchAdduser(addUser({uid:uid,email:email,displayName:displayName})) ; // navigate to browse when user logs in
            // ...
            const currentURL = window.location.href;

            //console.log(currentURL.endsWith("add") && currentURL.endsWith("friend"));
            const hubConnection = new HubConnectionBuilder()
            .withUrl(URL+'friendRequestHub') // Replace with the actual hub URL
            .build();
            console.log("Connection1",hubConnection)
      
        hubConnection
            .start()
            .then(() => {
                console.log('Connection started!');
                console.log(hubConnection)
               
                // Call JoinUserGroup method on the server
                    // Call JoinUserGroup method on the server
        hubConnection.invoke('JoinUserGroup', email)
        .then(() => console.log('Joined user group'))
        .catch((error) => console.error('Error calling JoinUserGroup:', error));
})

.catch((err) => console.error('Error while establishing connection:', err))
//dispatch(addConnection(hubConnection));

            if(!(currentURL.endsWith("add") || currentURL.endsWith("friend")))
            {
            navigate("/main");
            }
        } else {
            // User is signed out
            // ...
            dispatchRemoveuser(removeUser());
            navigate("/");
          //
        }
        return () => unsubscribe();
        });},[]);
 
    const handleSignOut =() =>
    {
        
        signOut(auth).then(() => {
          // Sign-out successful.
          
    
        }).catch((error) => {
       
        });
    }
        return(
        <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10  flex flex-col md:flex-row  items-center md: justify-between">
        <img className="w-20  h-20 m-2 p-1" alt="icon" src={Logo} />
        {user &&

            <button onClick={handleSignOut} className="bg-blue-600 h-10 p-2  text-white rounded-lg text-center"> Sign Out</button>
            
        
        
        }   
        
        </div>

    )
}

export default Header;