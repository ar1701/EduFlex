const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
      },
    };
  }
  
//   async function run() {
//     // For text-and-image input (multimodal), use the gemini-pro-vision model
//     const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
//     const prompt = "";
  
//     const imageParts = [
//       fileToGenerativePart("image1.webp", "image/webp"),
//     //   fileToGenerativePart("image2.jpeg", "image/jpeg"),
//     ];
  
//     const result = await model.generateContent([prompt, ...imageParts]);
//     const response = await result.response;
//     const text = response.text();
//     console.log(text);
//   }
  
//   run();

async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const prompt = "What is your name?"
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }
  
  run();