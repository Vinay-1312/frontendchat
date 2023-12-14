import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Header from "./Header";
import { Logo } from "../utils/constant";

const Login = () =>
{
    const provider = new GoogleAuthProvider();
    const dispatch = useDispatch(addUser);
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    auth.languageCode = 'it';
    const handleButtonClick = () =>
    {
        signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    const {uid,email,displayName} = auth.currentUser;
    dispatch(addUser({
                    uid:uid,
                    email:email,
                    displayName:displayName
                }))

    console.log("Login Successful")
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    console.log(errorMessage)
    const credential = GoogleAuthProvider.credentialFromError(error);
  
  });
    }
    return(
       
        <div>
         <Header />
    <form onSubmit = {(e)=> e.preventDefault()}className="w-full sm:full md:w-3/12 p-12 bg-gray-300 absolute my-36 mx-auto right-0 left-0 text-white bg-opacity-80">
               <img src={Logo} className=" mx-15 px-20" />

        <button className="p-4 my-4 bg-black w-full rounded-lg flex" onClick={handleButtonClick} > <span className="px-4">Sign in with Google</span> <img src="https://cdn-icons-png.flaticon.com/128/300/300221.png"  className="h-8 px-4 w-20"/> </button>

    </form>

    </div>
    )
}

export default Login; 