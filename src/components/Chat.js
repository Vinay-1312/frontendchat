// Chat.js
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import LeftSection from './LeftSection';
import Header from './Header';
import { useSelector } from 'react-redux';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { URL } from './constant';
const Chat = () => {
  const { username } = useParams();
  const { chatid } = useParams();
  const user = useSelector((store)=>store?.user);
  const chat = useSelector((store)=>store?.chat);
  const [connection, setConnection] = useState(null);

  const [messages, setMessages] = useState([
   
    // Add more messages as needed
  ]);
  const text = useRef(null);
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(URL+'fetchChat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: chatid,
          }),
        });
  
        if (!response.ok) {
          //console.log(response);
          throw new Error('Failed to fetch chat');
        }
  
        const data = await response.json();
  
        //console.log(data?.Message);
        setMessages(data?.Message); // Update state directly with fetched messages
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchChats();
    const hubConnection = new HubConnectionBuilder()
    .withUrl(URL+'friendRequestHub') // Replace with the actual hub URL
    .build();
    //console.log("Connection1",hubConnection)

    setConnection(hubConnection);
hubConnection
    .start()
    .then(() => {
        console.log('Connection started!');
        //console.log(hubConnection)
       
        // Call JoinUserGroup method on the server
            // Call JoinUserGroup method on the server
hubConnection.invoke('JoinUserGroup', user?.email)
.then(() => console.log('Joined user group'))
.catch((error) => console.error('Error calling JoinUserGroup:', error));
})
  }, []);
  useEffect(() => {
    console.log('Updated Messages:', messages);
  }, [messages]);

  useEffect(() => {

    const handleReceiveMessage = (receivedMessage) => {
      console.log("Message 0",messages[0]);
      console.log("ReceiveMessage",receivedMessage);
      const formattedMessage = receivedMessage.map(msg => ({
        Name: msg.name.charAt(0).toUpperCase() + msg.name.slice(1),
        Value: msg.value
    }));
    console.log("formatted",formattedMessage);
      setMessages(prevMessages => [...prevMessages, formattedMessage]);
    };
    connection?.on('ReceiveMessage', handleReceiveMessage);

  return () => {
    connection?.off('ReceiveMessage', handleReceiveMessage);
  };
  }, [connection, user, messages]);
  
  const handleSendMessage = async(message) => { 
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to no n-24-hour format
    const formattedHours = hours % 12 || 12;

    // Format minutes with leading zero if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
 
    // Create the formatted time string
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    // Implement sending a message logic and update the state
    message.timestamp = timeString
    message.id = chatid
   
    const response = await fetch(URL+'insertChat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(message),
            }
            );
      
            if (!response.ok) {
              ////console.log(response)
              throw new Error('Failed to fetch chat');
            }
            const data = await response.json();
            const newMessage = [
        
            ];
            const properties = ['_id', 'id', 'content', 'sender', 'timestamp'];

            properties.forEach((property) => {
              const messageProperty = {
                Name: property,
                Value: message[property],
              };
              //console.log(messageProperty);
              newMessage.push(messageProperty);
            });
                    
       
            setMessages(prevMessages => [...prevMessages, newMessage]);
            if (user && message && connection) {
             
              await connection?.invoke('SendMessage',  chat?.user, newMessage);
              
              //setMessages('');
            }

  };

  return (
   
    
    <div className='flex justify-between'>
       <div className="z-20 mt-[50px]">
      <LeftSection />
      </div>
      <div className="md:col-span-3 col-span-4  md:w-3/5 w-full p-2 hover:bg-gray-300">
    <div className="flex flex-col h-screen w-[100%] bg-gray-100">
      <div className="bg-green-500 text-white p-4">
        <h1 className="text-2xl font-bold">{username}</h1>
      </div>
      <div className="flex-grow overflow-y-auto">
        {messages.map((message, index) => (
       
      
          <div
            key={index}
            className={`flex ${
              message[3]?.Value=== user?.email ? 'justify-end' : 'justify-start'
            } mb-2`}
          >
            <div
              className={`bg-white border rounded-lg p-2 ${
                message[3]?.Value ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              <div className="text-sm text-gray-500">   {message[3]?.Value} </div>
              {message[2]?.Value} 
              <div className="text-sm text-gray-500">{ message[4]?.Value}</div>
            </div>
          </div>  
        ))} 
      </div>
      <div className="bg-white p-4">
        <div className="flex items-center">
          <textarea
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:border-green-500"
            placeholder="Type a message..." ref={text}
          ></textarea>
          <button
            onClick={() =>
              handleSendMessage({
                content:text.current.value,
                sender: user?.email,
                timestamp: '1:00 PM',
              })
            }
            className="bg-green-500 text-white p-2 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    </div>
    </div>
          
  
  );
};

export default Chat;
