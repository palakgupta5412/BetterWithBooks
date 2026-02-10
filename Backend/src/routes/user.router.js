import { Router } from "express";
import { getCurrentUser, logout, register } from "../controllers/user.controller.js";
import { login } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(verifyJWT , logout);
router.route('/current-user').get(verifyJWT , getCurrentUser);

export default router;
