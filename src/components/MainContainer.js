import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toggleAdd } from "../utils/addSlice"
import { useSelector } from "react-redux";
import AddFriend from "./AddFriend";
import LeftSection from "./LeftSection";
const MainContrainer = () =>
{

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const addValue = useSelector((store)=>store.add.showAdd);
   
    return(
   
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 m z-20 mt-[50px]">
    <LeftSection />
   
    
    <div className="md:col-span-3 col-span-4  md:w-3/5 w-full p-2 hover:bg-gray-300">
      <h2 className="text-2xl font-bold mb-4">Second Column</h2>
      <div>
        <p>Add Friend Content Goes Here</p>
      </div>
    </div>
  </div>
    );
}

export default MainContrainer;