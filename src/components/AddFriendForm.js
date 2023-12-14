import { useRef,useState } from "react";
import { useSelector } from "react-redux";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { URL } from "./constant";
const AddFriendForm = () =>
{

    const receiverEmail = useRef("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const user = useSelector((store)=>store.user);
    const handleSendRequest = async (e) =>
    {
        e.preventDefault();
        if(user?.email === receiverEmail?.current?.value)
        {
          setPopupContent("Cannot send request to yourself");
          setShowPopup(true);
        }
        else
        {
        try {

            const response = await fetch(URL+'addFriend', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                senderEmail: user.email,
                receiverEmail: receiverEmail.current.value,
                status:"sent"
              }),
            });
      
            if (!response.ok) {
              throw new Error('Failed to send email');
            }
      
            const data = await response.json();
            
            setPopupContent(data?.Message);
            setShowPopup(true);
           
        const hubConnection = new HubConnectionBuilder()
        .withUrl(URL+'friendRequestHub') // Replace with the actual hub URL
        .build();

        hubConnection
        .start()
        .then(() => {
            console.log('Connection started!');
            console.log(typeof(email))
            // Call JoinUserGroup method on the server
                // Call JoinUserGroup method on the server
    hubConnection.invoke('SendFriendRequest',  user.email,receiverEmail.current.value,)
    .then(() => console.log('Sent Request'))
    .catch((error) => console.error('Error calling JoinUserGroup:', error));
          });
        }
          catch (error) {
            console.error('Error sending email:', error);
          }
        }
    }
    const handleClosePopup = () =>
    {
        setShowPopup(false);
        setPopupContent("");
    }
return(
    <div className="max-w-xl mx-auto  p-5 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-pink-600">Friend Request</h2>
        <form onSubmit = {handleSendRequest} className="flex flex-col">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            ref={receiverEmail}
            type="email"
            id="username"
            name="username"
            placeholder="Enter Email"
            required
          />
        </div>

        <button
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          type="submit"
        >
          Send Request
        </button>
      </form>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="relative bg-white p-6 rounded-md shadow-md">
            <div className="flex justify-end">
              <button onClick={handleClosePopup} className="text-gray-600">
                &#10005;
              </button>
            </div>
            <p className="text-lg font-semibold mb-4">Message</p>
            <p className="text-gray-700">{popupContent}</p>
          </div>
        </div>
      )}
    </div>
);
}

export default AddFriendForm;