const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// send request to userId
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
            ],
        });
        if(existingConnectionRequest) {
            if(existingConnectionRequest.status === "accepted") return res.status(400).json({ message: "You are already connected!" });
            else if (existingConnectionRequest.status === "interested") return res.status(400).json({ message: "Connection request is already pending!" });
            else if (existingConnectionRequest.status === "rejected") {
                // Remove the previous rejected request before creating a new one
                await ConnectionRequest.deleteOne({ _id: existingConnectionRequest._id });
            }
        } 
        

        // check if the recipient user exist
        const recipient = await User.findById(toUserId);
        if(!recipient) {
            return res.status(400).json({error: "User not found!"});
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

// review the requests
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        // validate the status
        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message : "Status not allowed"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,               // validate request id
            toUserId : loggedInUser._id,   // check loggedIn userId === toUserId
            status: "interested",          // status should be interested only
        });

        if(!connectionRequest) {
            return res.status(404).json({message : "Invalid request"});
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            message: "You have " + status + " the invitation.",
            data : data,
        })
    } catch (err) {
        res.status(400).json({error : err.message});
    }
});

module.exports = requestRouter;