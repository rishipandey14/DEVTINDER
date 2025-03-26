const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age about gender";


// get all the pending connection request for the loggedIn user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId", USER_SAFE_DATA,
    );

    res.json({
      message: "Data fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get all the paired connections for the user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA,)
      .populate("toUserId", USER_SAFE_DATA,);

    // transform response to populate only other persons details
    const connection = await connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) return row.toUserId;
      else return row.fromUserId;
    });

    res.json({
      message: "Your connections :- ",
      data: connection,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});


userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {

    // user should see all the cards except
    // 0 -> his own card
    // 1 -> the card whom he has already send requests
    // 2 -> the cards with whom he already has connection
    // 3 -> ignored people

    const loggedInUser = req.user;

    // find all connection requests (sent + receive)
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ]
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const user = await User.find({
      $and : [
        {_id : { $nin : Array.from(hideUsersFromFeed)}},
        {_id : { $ne : loggedInUser._id}},
      ]
    }).select(USER_SAFE_DATA);

    res.send(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




module.exports = userRouter;