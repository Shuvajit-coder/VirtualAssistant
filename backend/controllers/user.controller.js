import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import moment from "moment/moment.js"


export const getCurrentUser = async(req, res)=>{
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(400).json({
                message:"user not found"
            })
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({
                message:"get current user error"
            })
    }
}

export const updateAssistant = async(req,res) => {
    try {

          console.log("FILE:", req.file);
        console.log("BODY:", req.body);
        
        const {assistantName, imageUrl} = req.body
        
        
        let assistantImage;
        if(req.file){
            assistantImage= await uploadOnCloudinary(req.file.path)
        }else{
            assistantImage= imageUrl
        }

        const user = await User.findByIdAndUpdate(req.userId,{
            assistantName,
            assistantImage

        },{new:true}).select("-password")
        return res.status(200).json(user)

    } catch (error) {
        console.log(error);
        return res.status(400).json({
                message:"UpdateAssistant  error"
            })
    }
}







export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    
     
    const user = await User.findById(req.userId);


    if (!user) {
      return res.status(404).json({
        type: "error",
        response: "User not found"
      });
    }
     user.history.push(command)
     await user.save()
    

    const userName = user.name;
    const assistantName = user.assistantName;

    const lowerCommand = command.toLowerCase();

    //  USE MOMENT 
    const now = moment();

    // =========================
    // LOCAL COMMANDS (FAST, NO GEMINI)
    // =========================

    if (lowerCommand.includes("time")) {
      return res.json({
        type: "get-time",
        userInput: command,
        response: `Current time is ${now.format("hh:mm A")}`
      });
    }

    if (lowerCommand.includes("date")) {
      return res.json({
        type: "get-date",
        userInput: command,
        response: `Current date is ${now.format("DD MMMM YYYY")}`
      });
    }

    if (lowerCommand.includes("day")) {
      return res.json({
        type: "get-day",
        userInput: command,
        response: `Today is ${now.format("dddd")}`
      });
    }

    if (lowerCommand.includes("month")) {
      return res.json({
        type: "get-month",
        userInput: command,
        response: `Month is ${now.format("MMMM")}`
      });
    }

    // =========================
    // SIMPLE COMMANDS
    // =========================

    if (lowerCommand.includes("open youtube")) {
      return res.json({
        type: "youtube-open",
        userInput: command,
        response: "Opening YouTube"
      });
    }

    if (lowerCommand.includes("open google")) {
      return res.json({
        type: "google-open",
        userInput: command,
        response: "Opening Google"
      });
    }

    if (lowerCommand.includes("open instagram")) {
      return res.json({
        type: "instagram-open",
        userInput: command,
        response: "Opening Instagram"
      });
    }

    // =========================
    // GEMINI CALL (FALLBACK)
    // =========================

    const result = await geminiResponse(command, userName, assistantName);

    if (!result || !result.type) {
      return res.json({
        type: "error",
        userInput: command,
        response: "AI is not available right now. Try later."
      });
    }

    if (result.type === "limit") {
      return res.json({
        type: "limit",
        userInput: command,
        response: "I'm a bit busy right now, please try again in a few seconds."
      });
    }

    return res.json({
      type: result.type,
      userInput: result.userInput,
      response: result.response || "No response"
    });

  } catch (error) {
    console.log("SERVER ERROR:", error);

    return res.status(500).json({
      type: "error",
      response: "Internal server error"
    });
  }
};