// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/api", storeController.getIndex);
storeRouter.get("/api/homes", storeController.getHomes);
storeRouter.get("/api/bookings", storeController.getBookings);
storeRouter.get("/api/favourites", storeController.getFavouriteList);

storeRouter.get("/api/homes/:homeId", storeController.getHomeDetails);
storeRouter.post("/api/favourites", storeController.postAddToFavourite);
storeRouter.post("/api/favourites/delete/:homeId", storeController.postRemoveFromFavourite);

module.exports = storeRouter;
