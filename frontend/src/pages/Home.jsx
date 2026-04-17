import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import userImg from "../assets/user.gif"
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";


function Home() {
  const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate()
  const[listening, setListening] = useState(false)
  const isSpeakingRef=useRef(false)
  const recognitionRef= useRef(null)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isRecognizingRef = useRef(false)
  const[ham, setHam] = useState(false)
  const synth = window.speechSynthesis
  const manuallyStoppedRef = useRef(false);


  const handleLogOut = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error);
    }
  }
  const startRecognition = () => {
    if(!isSpeakingRef.current && !isRecognizingRef.current){
    try {
      recognitionRef.current?.start()
     console.log("recognition requested to start");
     
    } catch (error) {
      if(error.name !== "InvalidStateError"){
        console.error("Start error", error)
      }
    }
  }
}




  const speak=(text)=>{
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang='hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindVoice = voices.find(v => v.lang === 'hi-IN');
     if(hindVoice){
      utterance.voice=hindVoice;
     }


     isSpeakingRef.current=true
    utterance.onend=()=>{
      setAiText("")
      isSpeakingRef.current=false
      setTimeout(() => {
         startRecognition();
      }, 800);
     
    }
    synth.cancel();
    synth.speak(utterance);
  }



const handleCommand = (data) => {
  let { type, userInput, response } = data;

  console.log("TYPE:", type);
  console.log("USER INPUT:", userInput);

  const input = (userInput || "").toLowerCase();

  //  CLEAN QUERY 
  const cleanQuery = input
    .replace("jarvis", "")
    .replace("search", "")
    .replace("in youtube", "")
    .replace("on youtube", "")
    .replace("youtube", "")
    .replace("play", "")
    .trim();

  const query = encodeURIComponent(cleanQuery);

  //  HANDLE LIMIT FIRST
  if (type === "limit") {
    speak("Sir, API limit reached. Please try again later.");
    console.log("API limit hit");
    return;
  }

  //  HANDLE ERROR TYPE
  if (type === "general" || type === "error") {

    if (input.includes("youtube") && input.includes("play")) {
      type = "youtube-play";

    } else if (input.includes("youtube")) {
      type = "youtube-search";

    } else if (input.includes("calculator")) {
      type = "calculator-open";

    } else if (input.includes("instagram")) {
      type = "instagram-open";

    } else if (input.includes("facebook")) {
      type = "facebook-open";

    } else if (input.includes("weather")) {
      type = "weather-show";

    } else if (input.includes("search") || input.includes("google")) {
      type = "google-search";
    } else if (input.includes("open") && input.includes("google")) {
  type = "google-open";
} else if (input.includes("search") && input.includes("google")) {
  type = "google-search";
}
  }

  //  SPEAK AFTER TYPE FIX
  speak(response);

  //  FINAL EXECUTION
  switch (type) {

    case "get-time":
      break;

    case "get-date":
      break;

    case "get-day":
      break;

       case "get-month":
      break;

    case "general":
      console.log("General response only");
      break;

    case "google-search":
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
      break;

    case "youtube-search":
      window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
      break;

    case "youtube-play":
      window.open(`https://www.youtube.com/results?search_query=${query}&autoplay=1`, "_blank");
      break;

    case "calculator-open":
      window.open("https://www.google.com/search?q=calculator", "_blank");
      break;

    case "instagram-open":
      window.open("https://www.instagram.com", "_blank");
      break;

    case "facebook-open":
      window.open("https://www.facebook.com", "_blank");
      break;
      case "google-open":
       window.open("https://www.google.com", "_blank");
        break;

    case "weather-show":
      window.open(`https://www.google.com/search?q=weather+${query}`, "_blank");
      break;

    default:
      console.log("Unknown command:", type);
      speak("Sorry, I didn't understand.");
  }
};




  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition ||window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.continuous = true,
    recognition.lang='en-US'

    recognitionRef.current=recognition

   

    let isMounted = true;

    const startTimeout = setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start()
          console.log("Recognition request to start");
          
        } catch (error) {
          if(error.name !== "InvalidStateError"){
        console.error("Start error", error)
      }
        }
      }
    },1000)

    



    recognition.onstart = ()=>{
      //console.log("recognition started");
      isRecognizingRef.current= true;
      setListening(true)
    };

    // recognition.onend =()=>{
    //   //console.log("Rcognition ended");
    //   isRecognizingRef.current = false;
    //   setListening(false);

    //   if(isMounted && !isSpeakingRef.current){
    //     setTimeout(() => {
    //       if(isMounted){
    //         try {
    //           recognition.start();
    //           console.log("recognition restarted");
    //         } catch (error) {
    //           if(error.name !== "InvalidStateError"){
    //             console.error( error)
    //         }
    //         }
    //       }
    //     }, 1000);
    //   }
    // }


    // recognition.onerror = (event) =>{
    //   console.warn("Recognition error:", event.error);
    //   isRecognizingRef.current = false;
    //   setListening(false);
    //   if(event.error !== "aborted" && !isSpeakingRef.current){
    //     setTimeout(() => {
    //       if(isMounted){
    //         try {
    //           recognition.start();
    //           console.log("recognition restarted after error");
              
    //         } catch (error) {
    //           if(error.name !== "InvalidStateError"){
    //          console.error("Start error", error)
    //          }
    //         }
    //       }
    //     },1000);
    //   }
    // }


   recognition.onend = () => {
  isRecognizingRef.current = false;
  setListening(false);

  // 🔥 STOP restart if manually stopped
  if (manuallyStoppedRef.current) {
    manuallyStoppedRef.current = false;
    return;
  }

  if (!isSpeakingRef.current) {
    setTimeout(() => {
      try {
        recognition.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error(error);
        }
      }
    }, 1000);
  }
};

   recognition.onerror = (event) => {
  console.warn("Recognition error:", event.error);

  if (event.error === "aborted") {
    // 🔥 DO NOTHING (this is expected when you stop manually)
    return;
  }

  isRecognizingRef.current = false;
  setListening(false);

  if (!isSpeakingRef.current) {
    setTimeout(() => {
      try {
        recognition.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Restart error:", error);
        }
      }
    }, 1000);
  }
};

    recognition.onresult= async (e)=>{
     const transcript = e.results[e.results.length-1][0].transcript.trim()
     console.log(transcript)

     if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
      setAiText("")
      setUserText(transcript)
      manuallyStoppedRef.current = true;
      
      recognition.stop();
     
      isRecognizingRef.current=false
      setListening(false)
     const data= await getGeminiResponse(transcript)
     //console.log(data);
     handleCommand(data)
      setAiText(data.response)
     setUserText("")
    
     }
    }

     
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what i can help you with?`);
      greeting.lang='en-IN';
      window.speechSynthesis.speak(greeting)
    
    
    return ()=>{
      isMounted=false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current= false;
      
    };


    
    
  },[]);




  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-center gap-4 px-4 relative overflow-hidden">

  {/*  MENU BUTTON (MOBILE) */}
  <CgMenuRight
    className="lg:hidden text-white absolute top-5 right-5 w-6 h-6 cursor-pointer z-50"
    onClick={() => setHam(true)}
  />

  {/*SIDEBAR */}
  <div
    className={`fixed top-0 right-0 lg:hidden w-[80%] sm:w-[60%] h-full 
    bg-black/80 backdrop-blur-sm p-5 flex flex-col gap-5 z-[100]
    transform ${ham ? "translate-x-0" : "translate-x-full"} 
    transition-transform duration-300`}
  >
    {/* CLOSE */}
    <RxCross1
      className="text-white absolute top-5 right-5 w-6 h-6 cursor-pointer z-[110]"
      onClick={() => setHam(false)}
    />

    {/* BUTTONS */}
    <button
      className="w-full h-12 mt-8 bg-white rounded-full text-black font-semibold"
      onClick={handleLogOut}
    >
      Log Out
    </button>

    <button
      className="w-full h-12 bg-white rounded-full text-black font-semibold px-4"
      onClick={() => navigate("/customize")}
    >
      Customize Your Assistant
    </button>

    {/* DIVIDER */}
    <div className="w-full h-[1px] bg-gray-400"></div>

    <h1 className="text-white font-semibold text-lg">History</h1>

    {/*  HISTORY */}
    <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
  {userData?.history?.length > 0 ? (
    [...userData.history].reverse().map((his, index) => (
      <span
        key={index}
        className="text-gray-200 hover:text-amber-200 text-sm break-words"
      >
        {his}
      </span>
    ))
  ) : (
    <span className="text-gray-400 text-sm">No history found</span>
  )}
</div>
  </div>

  {/* DESKTOP BUTTONS */}
  <div className="hidden lg:flex flex-col gap-4 absolute top-5 right-5">
    <button
      className="px-5 py-2 bg-white rounded-full text-black font-semibold"
      onClick={handleLogOut}
    >
      Log Out
    </button>

    <button
      className="px-5 py-2 bg-white rounded-full text-black font-semibold"
      onClick={() => navigate("/customize")}
    >
      Customize
    </button>
  </div>

  {/*  IMAGE */}
  <div className="w-[200px] sm:w-[250px] md:w-[300px] aspect-[3/4] flex justify-center items-center overflow-hidden shadow-lg rounded-3xl">
    <img
      src={userData?.assistantImage}
      alt=""
      className="w-full h-full object-cover"
    />
  </div>

  {/* NAME */}
  <h1 className="text-white text-base sm:text-lg font-semibold text-center">
    I'm {userData?.assistantName}
  </h1>

  {/* GIF */}
  {!aiText && (
    <img src={aiImg} alt="" className="w-[120px] sm:w-[160px]" />
  )}
  {aiText && (
    <img src={userImg} alt="" className="w-[120px] sm:w-[160px]" />
  )}

  {/* TEXT */}
  <h1 className="text-white text-sm sm:text-base font-semibold text-center px-2 break-words max-w-[90%] sm:max-w-[500px]">
    {userText ? userText : aiText ? aiText : null}
  </h1>

</div>
  )
}

export default Home
