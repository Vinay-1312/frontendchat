import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { chatFriend } from "../utils/chatSlice";
import { URL } from "./constant";
import { HubConnection,HubConnectionBuilder } from "@microsoft/signalr";
const LeftSection = () =>
{   const [friends, setFriends] = useState([]);
    const [chatIds,setIDs] = useState([]);
    const navigate = useNavigate()
    const dispatchAction = useDispatch();
    const user = useSelector((store)=>store?.user);
    const handleAddFriend = () =>
    {
        //dispatch(toggleAdd());
        if(!window.location.href.endsWith("/add"))
        {navigate("/add");}
    }
    const handleFriendRequest = () =>
    {
        //dispatch(toggleAdd());
        if(!window.location.href.endsWith("friend"))
        {navigate("/friend");
    }
    }
    useEffect(()=>
    {
    fetchData();
    },[])

    useEffect(()=>{ 
        const hubConnection = new HubConnectionBuilder()
        .withUrl(URL+'friendRequestHub') // Replace with the actual hub URL
        .build();
        console.log("Connection1",hubConnection)
  
    hubConnection
        .start()
        .then(() => {
            console.log('Connection started!');
            console.log(hubConnection)
    })
    hubConnection?.on('ReceiveFriends', (senderId) => {
        console.log('Friend request received from:', senderId);
        setFriends((prevRequests) => [...prevRequests, senderId]);

        return () => {
            if (hubConnection) {
              // Cleanup: Remove the event handler and stop the connection
              hubConnection.off('ReceiveFriends');
              hubConnection.stop();
            }
          };

        })
    },[user])

    const handleClick = (request) =>
    {
      dispatchAction(chatFriend({user:request}));
    }
   
    const fetchData = async() =>
    {
        
        const response = await fetch(URL+'friends', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
               receiverEmail: user?.email
              }),
            });
      
            if (!response.ok) {
              throw new Error('Failed to send email');
            }
            const data = await response.json();
            console.log("data",data);
            setFriends(data?.Message?.Result);
            const response1 = await fetch(URL+'ids', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
               receiverEmail: user?.email,
               senderEmail:data?.Message?.Result
              }),

            });
            if (!response1.ok) {
              console.log("response from server", response);
              throw new Error('Failed to send email');
            }
            const data1 = await response1.json();
            console.log("data",data1);
            setIDs(data1.Message);

    }
    
        

      return ( <div className="md:col-span-1 col-span-4 md:w-2/5 w-full pr-2">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <ul className="flex flex-col space-y-5 border-solid"> 
        <li> <button onClick={handleAddFriend} className="flex justify-between"><img className ="w-7" src="https://static.vecteezy.com/system/resources/previews/013/215/442/original/add-button-black-glyph-ui-icon-circle-with-plus-website-interactive-element-user-interface-design-silhouette-symbol-on-white-space-solid-pictogram-for-web-mobile-isolated-illustration-vector.jpg" /> <span className="text-pink-700">Add Friend</span></button></li>
        <li><button  onClick={handleFriendRequest} className="flex justify-between"><img className ="w-7 " src="https://static.thenounproject.com/png/545083-200.png" /> <span className="text-pink-700">Friend Requests</span></button></li>
        <li className="pt-5"><span className="text-black font-bold  text-lg">Friends</span></li>
        <hr className="my-2 border-t-1 border-gray-700"></hr>
        {friends?.map((request, index) => (
  <div key={index}>
    <li className="flex items-center justify-between rounded-md">
      <div className="bg-gray-100 font-sans">
        {console.log("chatids",chatIds)}
        {chatIds && chatIds[index] !== undefined ? (
          
          <Link to={`/chat/${chatIds[index]}`} onClick={()=>handleClick(request)}>
            <p className="text-lg font-semibold text-base">{request}</p>
          </Link>
        ) : (
          <p className="text-lg font-semibold text-base">{request}</p>
        )}
      </div> 
      <hr className="my-2 border-t-1 border-gray-700"></hr>
    </li>
  </div>
))}

      </ul>
    </div>)
  }


export default LeftSection;