import { Router } from "express";
import { getMinecraftUserData } from "../controllers/mojan-controller.js";

const minecraftRouter = Router();

minecraftRouter.get("/user-data/:username", getMinecraftUserData);

export default minecraftRouter;
