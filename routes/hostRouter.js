// External Module
const express = require("express");
const hostRouter = express.Router();

// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/api/host/add-home", hostController.getAddHome);
hostRouter.post("/api/host/add-home", hostController.postAddHome);
hostRouter.get("/api/host/host-home-list", hostController.getHostHomes);
hostRouter.get("/api/host/edit-home/:homeId", hostController.getEditHome);
hostRouter.post("/api/host/edit-home", hostController.postEditHome);
hostRouter.post("/api/host/delete-home/:homeId", hostController.postDeleteHome);

module.exports = hostRouter;
