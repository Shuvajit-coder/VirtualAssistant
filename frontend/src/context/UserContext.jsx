import React, { createContext, useState } from 'react'
import { useEffect } from 'react'
export const userDataContext = createContext()
import axios from "axios"

function UserContext({children}){
    const serverUrl="https://virtualassistant-backend-32yv.onrender.com"
    const [userData, setUserData] = useState(null)
    const[frontendImage, setFrontendImage] = useState(null)
    const[backendImage, setBackendImage] = useState(null)
    const [selectedImage, setSelectedImage] =useState(null)
    const haandleCurrentUser= async()=>{
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials: true})

        setUserData(result.data)
        console.log(result.data);
        
      } catch (error) {
        console.log(error);
        
      }
    }


  


  const getGeminiResponse = async (command) => {
  try {
    //  Assistant call
    const result = await axios.post(
      `${serverUrl}/api/user/asktoassistant`,
      { command },
      { withCredentials: true }
    );

    //  Fetch updated user (IMPORTANT)
    const updatedUser = await axios.get(
      `${serverUrl}/api/user/current`,
      { withCredentials: true }
    );

    //  Update global state
    setUserData(updatedUser.data);

    //  Return assistant response
    return result.data;

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    return { reply: "Something went wrong" };
  }
};


    useEffect(() =>{
      haandleCurrentUser()
    },[])

    const value={
      serverUrl,
      userData,
      setUserData,backendImage, setBackendImage,frontendImage, setFrontendImage,
      selectedImage, setSelectedImage, getGeminiResponse
    }
  return (
    <div>
      <userDataContext.Provider value={value}>
      {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
