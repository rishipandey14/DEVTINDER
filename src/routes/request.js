const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // validate status
        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message : "Invalid status type " + status});
        }

        // check if connection request already exist
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId},
            ]
        });
        if(existingConnectionRequest) {
            return res.status(400).json({message : "Connection request already exist!!"});
        }

        // check if the recipient user exist
        const recipient = await User.findById(toUserId);
        if(!recipient) {
            res.status(400).json({message: "User not found!"});
        }

        // create and save the connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data: connectionRequest,
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = requestRouter;