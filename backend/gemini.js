import axios from "axios";

// const geminiResponse = async (command,  userName,assistantName,) => {
//   try {
//     const apiUrl = process.env.GEMINI_API_URL;

//     const prompt = `
// You are a smart voice-enabled virtual assistant named "${assistantName}", created by ${userName}.
// You were developed or programmed by "Shuvajit Bera".
//  Rules:
// - You are NOT Google.
// - Respond like a real voice assistant.
// - Always return ONLY valid JSON (no extra text).
// -NEVER say your name is "${userName}"

//  Output Format:
// {
//   "type": "<intent_type>",
//   "userInput": "<cleaned input>",
//   "response": "<short voice reply>"
// }

//  Intent Types:
// "general", "google-search", "youtube-search", "youtube-play",
// "calculator-open", "instagram-open", "facebook-open",
// "weather-show", "get-time", "get-date", "get-day", "get-month"

// 🎯 INTENT DETECTION (STRICT):

// - If sentence contains "youtube" AND "search" → "youtube-search"
// - If sentence contains "youtube" AND ("play" OR "song" OR "video") → "youtube-play"
// - If sentence contains "youtube" → "youtube-search"

// - If sentence contains "google" OR "search" → "google-search"

// - If sentence contains "instagram" → "instagram-open"
// - If sentence contains "facebook" → "facebook-open"
// - If sentence contains "calculator" → "calculator-open"

// - If sentence contains "weather" → "weather-show"
// - If sentence contains "time" → "get-time"
// - If sentence contains "date" → "get-date"

// - Otherwise → "general"

//  Rules:
// - Remove assistant name from input
// - For search → keep only keywords

//  Response Style:
// - Max 25 words
// - Natural voice tone

// Special:
// If asked "who created you" → say ${userName}

// User Input: "${command}"
// `;

//     const result = await axios.post(
//       apiUrl,
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ]
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": process.env.GEMINI_API_KEY
//         }
//       }
//     );

//     const text = result.data.candidates[0].content.parts[0].text;

//     //  SAFE JSON PARSE
//     let parsed;
//     try {
//       parsed = JSON.parse(text);
//     } catch (e) {
//       parsed = {
//         type: "general",
//         userInput: command,
//         response: text
//       };
//     }

//     return parsed;

//   } catch (error) {
//     console.log("ERROR:", error.response?.data || error.message);

//     return {
//       type: "error",
//       userInput: command,
//       response: error.message || "Something went wrong"
//     };
//   }
// };



const geminiResponse = async (command, userName, assistantName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;

    const prompt = `
You are a smart voice-enabled virtual assistant named "${assistantName}", created by ${userName}.
You were developed or programmed by "Shuvajit Bera".

STRICT RULES:
- Always return ONLY valid JSON
- No extra text, no explanation
- JSON must be parseable
- NEVER say your name is "${userName}"

 OUTPUT FORMAT:
{
  "type": "<intent_type>",
  "userInput": "<cleaned input>",
  "response": "<short voice reply>"
}

 INTENT TYPES:
"general", "google-search", "youtube-search", "youtube-play",
"calculator-open", "instagram-open", "facebook-open",
"weather-show", "get-time", "get-date", "get-day", "get-month"

 INTENT DETECTION (STRICT):

- If sentence contains "youtube" AND "search" → "youtube-search"
- If sentence contains "youtube" AND ("play" OR "song" OR "video") → "youtube-play"
- If sentence contains "youtube" → "youtube-search"

- If sentence contains "open" AND "google" → "google-open"
- If sentence contains "google" AND "search" → "google-search"

- If sentence contains "instagram" → "instagram-open"
- If sentence contains "facebook" → "facebook-open"
- If sentence contains "calculator" → "calculator-open"

- If sentence contains "weather" → "weather-show"
- If sentence contains "time" → "get-time"
- If sentence contains "date" → "get-date"
- If sentence contains "day" → "get-day"
- If sentence contains "month" → "get-month"

- "general": if it's a factual or information question.
if anyone ask you a quesion and you know the answer then keep the question in general category and give short answer of that question.

 RULES:
- Remove assistant name from input
- Keep only keywords for search

RESPONSE STYLE:
- Max 20 words
- Natural voice tone

SPECIAL:
If asked "who created you" → say "${userName}"

User Input: "${command}"
`;

    const result = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        }
      }
    );

    //  SAFE ACCESS (NO TypeError)
    const text =
      result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        type: "error",
        userInput: command,
        response: "Empty response from AI"
      };
    }

    //  SAFE JSON PARSE
    try {
      return JSON.parse(text);
    } catch (e) {
      return {
        type: "general",
        userInput: command,
        response: text
      };
    }

  } catch (error) {
    console.log("GEMINI ERROR:", error.response?.data || error.message);

    //  HANDLE QUOTA ERROR (VERY IMPORTANT)
    if (error.response?.data?.error?.status === "RESOURCE_EXHAUSTED") {
      return {
        type: "limit",
        userInput: command,
        response: "I'm a bit busy right now, please try again in a few seconds."
      };
    }

    // HANDLE OTHER ERRORS
    return {
      type: "error",
      userInput: command,
      response: "AI request failed"
    };
  }
};

export default geminiResponse;
