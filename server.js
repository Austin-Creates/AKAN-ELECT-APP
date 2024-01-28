const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Voter = require("./src/models/voterModel");
const Vote = require("./src/models/voteModel");
const Leader = require("./src/models/leaderModel");

mongoose
  .connect("mongodb://127.0.0.1:27017/akanvotingdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });

const app = express();
app.use(bodyParser.json());

//ROUTES
// home route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// voter signup
app.post("/signup", async (req, res) => {
  try {
 
    // encrypt password
    //bcrypt password encryption
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const voter = new Voter(req.body);
    await voter.save();
    res.status(200).send({ voter });
  } catch (error) {
    res.status(400).send(error);
  }
});

// voter login
app.post("/login", async (req, res) => {
  try {
    // email validation
    // bcrypt password decryption

    const voter = await Voter.findOne({ email: req.body.email });
    if (!voter) {
      return res.status(404).send({ message: "Voter not found" });
    }

    await bcrypt.compareSync(req.body.password, voter.password).then((result) => {
        console.log(result);
        if (result) {
            res.status(200).send({ voter });
        } else {
            res.status(400).send({ message: "Invalid password" });
        }
        }
    );

  } catch (error) {
    res.status(400).send(error);
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
        position: "Head",
      },
      {
        position: "planning and coordination",
      },
      {
        position: "sports",
      },
      {
        position: "clubs",
      },
      {
        position: "finance",
      },
      {
        position: "resource",
      },
      {
        position: "events",
      },
      {
        position: "arts",
      },
      {
        position: "junior",
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
app.post("/leader", async (req, res) => {
  try {
    // we check if the leader is in the database
    const voterExistaAsALeader = await Leader.findOne({
      voter: req.body.voter,
    });

    if (voterExistaAsALeader) {
      return res.status(404).send({ message: "Voter is already a leader" });
    }

    const leader = new Leader(req.body);
    await leader.save();
    res.status(200).send({ leader });
  } catch (error) {
    res.status(400).send(error);
  }
});

// all leaders

app.get("/leaders", async (req, res) => {
  try {
     const position = req.params.position;
     if(position){
        const leaders = await Leader.find({position}).populate("voter");
        if (!leaders) {
          return res.status(404).send({ message: "Leaders not found" });
        }
        res.status(200).send({ leaders });
        }


    
    const leaders = await Leader.find({}).populate("voter");
    if (!leaders) {
      return res.status(404).send({ message: "Leaders not found" });
    }
    res.status(200).send({ leaders });
  } catch (error) {
    res.status(400).send(error);
  }
});



app.post("/vote", async (req, res) => {
  try {
    console.log(req.body);

    let voter = await Voter.findById(req.body.voter); // mathew

    if (!voter) {
      return res.status(404).send({ message: "Voter not found" });
    }

    // we check if the voter has voted before
    const voterHasVoted = await Vote.findOne({
      voter: req.body.voter,
    });

    if (voterHasVoted) {
        return res.status(404).send({ message: "Voter has voted before" });
        }

    let leader = await Leader.findById(req.body.leader); // john
    console.log(leader);
    if (!leader) {
      return res.status(404).send({ message: "Leader not found" });
    }


    let updateLeadersVote = await Leader.findByIdAndUpdate(req.body.leader, {
      $inc: { vote: 1 },
    });


    let vote = new Vote({
        voter: req.body.voter,
        leader: req.body.leader,
        });

    await vote.save();


    if (updateLeadersVote) {
      res.send({ message: "Vote successful" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// all votes
app.get("/votes", async (req, res) => {
  try {
    const all_leaders = await Leader.find({}).populate("voter");
    console.log(all_leaders);
    let voteResults = [];
    all_leaders.forEach((leader) => {
      console.log(leader);
      voteResults.push({
        leader: leader.voter.full_name,
        vote: leader.vote,
        position: leader.position,
      });
    });

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

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
