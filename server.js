const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const excelJS = require("exceljs");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
dotenv.config();

const secretKey =  process.env.SECRET_KEY;  

const Voter = require("./src/models/voterModel");
const Vote = require("./src/models/voteModel");
const Leader = require("./src/models/leaderModel");
const sendEmail = require("./src/models/utils/emailService");

const mongodb_url = process.env.MONGO_URL;

mongoose
  .connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());


let storage  = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/uploads');
  },
  filename: function (req, file, callback) {
    let filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    callback(null, filename);
  }
})

const upload = multer({ storage: storage });
//ROUTES
// home route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// voter signup
app.post("/signup", async (req, res) => {
  try {

    console.log(req.body)

    if(!req.body.password || !req.body.email || !req.body.full_name || !req.body.title || !req.body.grade){
      return res.status(400).send({ error: "Please fill all fields" });
    }
    // email validation
    let email = req.body.email;
    let grade = parseInt(req.body.grade)
    let existingVoter = await Voter.findOne({
      email: email,
    });

    if (existingVoter) {
      return res.status(404).send({ message: "Voter already exists" });
    }

    // example of email extension @akesk.org or @student.akesk.org
    let emailExtension = email.split("@")[1];
    let emailValidation =
      emailExtension === "akesk.org" || emailExtension === "student.akesk.org";
    if (!emailValidation) {
      return res.status(500).send({ error: "Invalid email" });
    }

    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const voter = new Voter({
      full_name: req.body.full_name,
      email: req.body.email,
      password: req.body.password,
      title: req.body.title,
      grade: grade,
      role: req.body.role || "voter",
    
    });
    await voter.save();
    res.status(200).send({ voter });
  } catch (error) {
    res.status(400).send(error);
  }
});

// bulk voter signup
app.post("/bulk/signup", async (req, res) => {
  try {
    let voters = [
      {
       "email": "dickensjuma13@gmail.com",
      "password": "password123",
      "title":"teacher",
      "full_name": "Dickens Juma",
      "grade": 1,
       "role": "admin" 
      }
  ]
    console.log(voters)
    let newVoters = [];
    voters.forEach((voter) => {
      // send email to the voters to send them their password
    
      sendEmail(voter, "Voter Registration");
      voter.password = bcrypt.hashSync(voter.password, 10);
      newVoters.push(voter);
    });
u
    const voter = await Voter.insertMany(newVoters);
   

    res.status(200).send({ voter });
  } catch (error) {
    res.status(400).send(error);
  }
});

// voter login
app.post("/login", async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: "Please provide an email and password" });
    }

    // Find the voter by email
    const voter = await Voter.findOne({ email });

    if (!voter) {
      return res.status(404).json({ message: "Sorry, Voter not found" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, voter.password);


    if (passwordMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: voter._id, email: voter.email },
        secretKey,
        { expiresIn: "1h" }
      );
     
      return res.status(200).json({ voter, token });
    } else {
      return res.status(500).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
// update voter
app.put("/voter/:_id", async (req, res) => {
  try {
    const updateVoter = await Voter.findByIdAndUpdate(req.params._id, req.body);

    if (!updateVoter) {
      return res.status(404).send({ message: "Voter not found" });
    }
    res.status(200).send({ updateVoter });
  } catch (error) {
    res.status(400).send(error);
  }
});

// get a voter
app.get("/voter/:_id", async (req, res) => {
  try {
    const voter = await Voter.findById(req.params._id);

    if (!voter) {
      return res.status(404).send({ message: "Voter not found" });
    }
    res.status(200).send({ voter });
  } catch (error) {
    res.status(400).send(error);
  }
});

// all positions
app.get("/positions", async (req, res) => {
  try {
    const positions = [
      {
        position: "Head Prefect",
      },
      {
        position: "Planning and Coordination Prefect",
      },
      {
        position: "Sports Prefect",
      },
      {
        position: "Clubs Prefect",
      },
      {
        position: "Finance Prefect",
      },
      {
        position: "Resource Prefect",
      },
      {
        position: "Events Prefect",
      },
      {
        position: "Arts Prefect",
      },
      {
        position: "Junior Representatives",
      },
    ];
    if (!positions) {
      return res.status(404).send({ message: "Leaders not found" });
    }
    res.status(200).send({ positions });
  } catch (error) {
    res.status(400).send(error);
  }
});

// create a leader
app.post("/leader", upload.single('photo') ,async (req, res) => {
  try {
  
    console.log(req.file)
    req.body.photo = req.file.path;

   //remove the public from the path
    req.body.photo = req.body.photo.replace("public/", "");
    console.log(req.body.photo)


    if(!req.body.voter || !req.body.position || !req.body.photo){
      return res.status(400).send({ error: "Please fill all fields" });
    }
    // we check if the leader is in the database
    const voterExistaAsALeader = await Leader.findOne({
      voter: req.body.voter,
    });

    if (voterExistaAsALeader) {
      return res.status(404).send({ message: "Voter is already a leader" });
    }

    const leader = new Leader(req.body);
    await leader.save();
    res
      .status(200)
      .send({
        leader,
        message: `Leader has been nominated for ${leader.position}`,
      });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// update a leader
app.put("/leader/:_id", async (req, res) => {
  try {
    const updateLeader = await Leader.findByIdAndUpdate(
      req.params._id,
      req.body
    );

    if (!updateLeader) {
      return res.status(404).send({ message: "Leader not found" });
    }
    res.status(200).json({ message: "Leader updated successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// all leaders
app.get("/all/leaders", async (req, res) => {
  try {
    let leaders;
    const allPositions = await Leader.distinct("position");
    const voteResults = [];

    for (const position of allPositions) {
      leaders = await Leader.find({ position }).populate("voter");
      const totalVotes = leaders.reduce((acc, leader) => acc + leader.vote, 0);

      leaders.forEach((leader) => {
        const percentage =
          totalVotes !== 0 ? (leader.vote / totalVotes) * 100 : 0;
        voteResults.push({
          leader: leader.voter.full_name,
          vote: leader.vote,
          position: leader.position,
          percentage: percentage.toFixed(2), // Limiting to 2 decimal places
        });
      });
    }

    if (!leaders) {
      return res.status(404).send({ message: "Leaders not found" });
    }
    res.status(200).send({ leaders });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/leaders", async (req, res) => {
  try {
    const position = req.params.position || req.query.position;

    let leaders = await Leader.find({ position }).populate("voter");

    return res.status(200).send({ leaders });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/vote", async (req, res) => {
  try {
    if(!req.body.voter || !req.body.leader){
      return res.status(400).send({ error: "Please fill all fields" });
    }

    let voter = await Voter.findById(req.body.voter); // mathew

    if (!voter) {
      return res.status(404).send({ message: "Voter not found" });
    }
    let leader = await Leader.findById(req.body.leader); // john
    if (!leader) {
      return res.status(404).send({ message: "Leader not found" });
    }

    // we check if the voter has voted before
    const voterHasVoted = await Vote.findOne({
      voter: req.body.voter,
      position: leader.position,
    });

    if (voterHasVoted) {
      return res
        .status(404)
        .send({ message: ` ❌ You have already voted for ${leader.position}` });
    }

    let updateLeadersVote = await Leader.findByIdAndUpdate(req.body.leader, {
      $inc: { vote: 1 },
    });

    let vote = new Vote({
      voter: req.body.voter,
      leader: req.body.leader,
      position: leader.position,
    });

    await vote.save();

    if (updateLeadersVote) {
      res.send({ message: `You have voted for ${leader.position}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// all votes with percentage
app.get("/votes", async (req, res) => {
  try {
    const allPositions = await Leader.distinct("position");
    const voteResults = [];

    for (const position of allPositions) {
      const leaders = await Leader.find({ position }).populate("voter");
      const totalVotes = leaders.reduce((acc, leader) => acc + leader.vote, 0);

      leaders.forEach((leader) => {
        const percentage =
          totalVotes !== 0 ? (leader.vote / totalVotes) * 100 : 0;
        voteResults.push({
          leader: leader.voter.full_name,
          vote: leader.vote,
          position: leader.position,
          percentage: percentage.toFixed(2), // Limiting to 2 decimal places
        });
      });
    }

    res.status(200).send({ voteResults });
  } catch (error) {
    res.status(400).send(error);
  }
});

// all voters
app.get("/voters", async (req, res) => {
  try {
    const voters = await Voter.find({});
    if (!voters) {
      return res.status(404).send({ message: "Voters not found" });
    }
    res.status(200).send({ voters });
  } catch (error) {
    res.status(400).send(error);
  }
});


// votes reult in excel format

app.get("/votes/excel", async (req, res) => {
  try{

    const allPositions = await Leader.distinct("position");
    const voteResults = [];

    for (const position of allPositions) {
      const leaders = await Leader.find({ position }).populate("voter");
      const totalVotes = leaders.reduce((acc, leader) => acc + leader.vote, 0);

      leaders.forEach((leader) => {
        const percentage =
          totalVotes !== 0 ? (leader.vote / totalVotes) * 100 : 0;
        voteResults.push({
          leader: leader.voter.full_name,
          vote: leader.vote,
          position: leader.position,
          percentage: percentage.toFixed(2), // Limiting to 2 decimal places
        });
      });
    };

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("VotesResults");
    // [
    //   {
    //       "leader": "Arjun Shah",
    //       "vote": 1,
    //       "position": "head prefect",
    //       "percentage": "100.00"
    //   },

    // ]
    worksheet.columns = [ 
      { header: "Leader", key: "leader", width: 30 },
      { header: "Vote", key: "vote", width: 10 },
      { header: "Position", key: "position", width: 30 },
      { header: "Percentage", key: "percentage", width: 30 },
    ];
  
    voteResults.forEach((vote) => { worksheet.addRow(vote) });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    workbook.xlsx.write(res).then(() => res.end());

  }catch(error){
    res.status(500).json({ error: error.message })
  }

});



app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
