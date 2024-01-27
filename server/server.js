const express = require("express");
const fs = require('fs');
const path = require("path");
const phpExpress = require("php-express")({
    binPath: "C:/php-8.3.2/php.exe", // Path to the PHP installation
    // root: path.join(__dirname, "..", "loginphp"),
});


const app = express();
const dataFile = path.join(__dirname, "..", "hbg.json"); //Data File


// Serve static files from the "root" directory
app.use(express.static(path.join(__dirname, "..", "headbg")));
app.use(express.static(path.join(__dirname, "..", "loginphp")));
app.use(express.static(path.join(__dirname, "..", "sports")));
app.use(express.static(path.join(__dirname, "..", "arts")));
app.use(express.static(path.join(__dirname, "..", "clubs")));
app.use(express.static(path.join(__dirname, "..", "finance")));
app.use(express.static(path.join(__dirname, "..", "jnr")));
app.use(express.static(path.join(__dirname, "..", "info")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/", (req, res) => {
    // Send the main HTML file as the response
    res.sendFile(path.join(__dirname, "..", "loginphp", "login.php"));
});

// Route for serving the Head Boy form
app.get("/headbg", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "headbg", "headboy.html"));
});

// Route for serving the Sports form
app.get("/sports", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "sports", "sports.html"));
});

// Route for serving the clubs form
app.get("/clubs", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "headbg", "headboy.html"));
});

// Route for serving the arts form
app.get("/arts", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "sports", "sports.html"));
});
// Route for serving the finance form
app.get("/finance", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "headbg", "headboy.html"));
});

// Route for serving the info form
app.get("/info", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "sports", "sports.html"));
});
// Route for serving the midschool reps form
app.get("/jnr", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "headbg", "headboy.html"));
});


app.get("/poll", async (req, res) => {
    
    try {
        let data = await readDataFile(dataFile);
        const totalVotes = data.votes.length;

        data = data.votes.map(vote => {
            return {
                headBoy: vote.headBoy,
                headGirl: vote.headGirl,
                timestamp: vote.timestamp
            };
        });

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

app.post("/submit", async (req, res) => {
    const formData = req.body; // Extract submitted form data

    
    // Determine which form was submitted and save the data accordingly
    if (formData.formType === "headbg") {
        delete formData.formType;
        delete formData.subFormType;
        formData.timestamp = new Date().toLocaleString();
        await saveVoteDataToFile(formData, "hbg.json");

    } else if (formData.formType === "sports") {
        delete formData.formType;
        delete formData.subFormType;
        formData.timestamp = new Date().toLocaleString();
        await saveVoteDataToFile(formData, "sports.json");
    } else if (formData.formType === "arts") {
        delete formData.formType;
        delete formData.subFormType;
        formData.timestamp = new Date().toLocaleString();
        await saveVoteDataToFile(formData, "arts.json");
    } else if (formData.formType === "clubs") {
        delete formData.formType;
        delete formData.subFormType;
        formData.timestamp = new Date().toLocaleString();
        await saveVoteDataToFile(formData, "clubs.json");
    } else if (formData.formType === "finance") {
        delete formData.formType;
        delete formData.subFormType;
        formData.timestamp = new Date().toLocaleString();
        await saveVoteDataToFile(formData, "finance.json");
    } else if (formData.formType === "jnr") {
        delete formData.formType;
        delete formData.subFormType;
        formData.timestamp = new Date().toLocaleString();
        await saveVoteDataToFile(formData, "jnr.json");
    } else if (formData.formType === "info") {
        delete formData.formType;
        delete formData.subFormType;
        formData.timestamp = new Date().toLocaleString();
        await saveVoteDataToFile(formData, "info.json");
    };
     
    res.redirect("http://127.0.0.1:3000/nav%20page/nav.html");
});

async function saveVoteDataToFile(voteData) {
    try {
        const existingData = await readDataFile(dataFile);
        existingData.votes.push(voteData);

        await writeDataFile(dataFile, existingData);
    } catch (error) {
        console.error(error);
    }
}

function readDataFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        });
    });
}

function writeDataFile(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, JSON.stringify(data), 'utf-8', (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

app.listen(3000, "127.0.0.1", () => {
    console.log("Server is running on http://127.0.0.1:3000");
});