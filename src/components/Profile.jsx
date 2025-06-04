import React ,{useEffect}from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (user && user._id) {
      await dispatch(logout(user._id));
    }
    navigate("/login");
  };

  

 

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Profile</h2>
      <div className="mb-2">
        <span className="font-semibold">Full Name:</span> {user.fullName}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Email:</span> {user.email}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Username:</span> {user.username}
      </div>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;