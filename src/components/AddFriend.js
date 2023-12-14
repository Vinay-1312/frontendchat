import AddFriendForm from "./AddFriendForm";
import Header from "./Header";
import LeftSection from "./LeftSection";

const AddFriend = () =>
{
    console.log("Here");
    return(
        <div className="flex flex-col space-y-56">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 m z-20 mt-[50px]">
            <LeftSection />
            <AddFriendForm />
        </div>
        </div>
    );
}

export default AddFriend;