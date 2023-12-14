import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeftSection from './LeftSection';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import signalR from '@microsoft/signalr';
import { URL } from './constant';

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const FriendRequest = () =>
{    const [friendRequests, setFriendRequests] = useState([]);
    const [connection, setConnection] = useState(null);
    //const connectionHub = useSelector((store)=>store.connection.connection)
    //console.log(connectionHub);
    const user = useSelector((store)=>store?.user);
   const handleFriendRequest = async(request,status) =>
   {
    try {
        const response = await fetch(URL+'addFriend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderEmail: request,
            receiverEmail: user?.email,
            status:status
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to send email');
        }
    }
    catch (error) {
        console.error('Error sending email:', error);
      }
     await fetchData();
   }
    useEffect(() => {
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
        hubConnection.invoke('JoinUserGroup', user?.email)
        .then(() => console.log('Joined user group'))
        .catch((error) => console.error('Error calling JoinUserGroup:', error));
        
})

.catch((err) => console.error('Error while establishing connection:', err))
    
        setConnection(hubConnection);
        fetchData()
        hubConnection?.on('ReceiveFriendRequest', (senderId) => {
            console.log('Friend request received from:', senderId);
            setFriendRequests((prevRequests) => [...prevRequests, senderId]);

            return () => {
                if (hubConnection) {
                  // Cleanup: Remove the event handler and stop the connection
                  hubConnection.off('ReceiveFriendRequest');
                  hubConnection.stop();
                }
              };
      })}, [user]);
   

    const fetchData = async() =>
    {
        
        const response = await fetch(URL+'friendRequests', {
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
        
        setFriendRequests(data?.Message?.Result);
    }
    
        
     
      
    return(
       
        <div className="flex flex-col space-y-56">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 m z-20 mt-[50px]">
            <LeftSection />
            <div className="mt-0">
                <h1 className="text-2xl font-bold mb-4 text-pink-600">Friend Requests</h1>
                <ul className="space-y-4">
                    {friendRequests?.map((request,index) => (
                        <li key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
                            <div>
                                <p className="text-lg font-semibold p-4">{request} </p>
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={()=>handleFriendRequest(request,"Accepted")}>Accept</button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={()=>handleFriendRequest(request,"Rejected")}>Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
                </div>
    </div>          
    )
}
export default FriendRequest;