if(process.env.NODE_ENV != "production") {
    require("dotenv").config(); 
  }
  
  const express = require("express");
  const app = express();
  const path = require("path");
  const ejsMate = require("ejs-mate");
  const bodyParser = require("body-parser");
  const multer = require('multer');


  
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "/views"));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.urlencoded({ extended: true }));
  app.engine("ejs", ejsMate);
  app.use(bodyParser.json());

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

let port = 8080;
app.listen(port, ()=>{
    console.log("listening to the port " + port);
})

app.get("/index", (req,res)=>{
    res.render("index.ejs");
})

app.get("/about", (req,res)=>{
    res.render("about.ejs");
})

app.get("/contact", (req,res)=>{
    res.render("contact.ejs");
})

app.get("/team", (req,res)=>{
    res.render("team.ejs");
})

app.get("/testimonial", (req,res)=>{
    res.render("testimonial.ejs");
})

app.get("/courses", (req,res)=>{
    res.render("courses.ejs");
})
app.get("/form", (req,res)=>{
    res.render("form.ejs");
})
app.get("/search", (req,res)=>{
    res.render("search.ejs");
})
app.get("/syllabus", (req,res)=>{
    res.render("syllabus.ejs");
})
app.get("/ask", (req,res)=>{
    res.render("ask.ejs");
})
app.get("/chat", (req,res)=>{
    res.render("chat.ejs");
})

app.post("/syllabus", async(req,res)=>{
    let {std, subject} = req.body;
    let result = await syllabusGen(std, subject);

    res.render("syl.ejs", { result });
})
app.post("/ask", async(req,res)=>{
    let {question} = req.body;
    let result = await textQuery(question);

    res.render("ask2.ejs", { result });
})
app.post("/chat", async (req, res) => {
    try {
        // Extract the user message from the request body
        const userInput = req.body.message;

        // Generate a response from the chatbot model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(userInput);
        const response = await result.response;
        const text = response.text();

        // Send the response back to the client
        res.json({ message: text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.post('/form', upload.single('image'), async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        const prompt = '';
        const imageParts = [{
            inlineData: {
                data: fs.readFileSync(req.file.path).toString('base64'),
                mimeType: 'image/jpeg'
            }
        }];

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();
        res.json({ result: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});






const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");


const dotenv = require("dotenv");
dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
      },
    };
  }
  
  async function problemSolving() {
    // For text-and-image input (multimodal), use the gemini-pro-vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
    const prompt = "";
  
    const imageParts = [
      fileToGenerativePart("prob.jpg", "image/jpeg"),
    //   fileToGenerativePart("image2.jpeg", "image/jpeg"),
    ];
  
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  }
  
  // problemSolving();

async function textQuery(query) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    // const prompt = "What is Newton's First Law ?"
  
    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();
    return text;
  }
  
  // textQuery();

async function syllabusGen(std, sub) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const prompt = `Generate the Syllabus of ${std} for the subject ${sub}`
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }
  
  


async function chatBot(reply) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  async function askAndRespond(){
    rl.question("You: ", async(reply)=>{
      if(reply.toLowerCase() === "exit"){
        rl.close();
      }
      else{
        const result = await model.generateContent(reply);
        const response = await result.response;
        const text = await response.text();
        console.log("AI: ", text);
        return text;
        askAndRespond();
      }
    });
  }
  askAndRespond();
}

// chatBot();

