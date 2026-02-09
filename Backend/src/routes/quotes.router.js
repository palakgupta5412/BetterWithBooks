import { Router } from "express";
import { createQuote, getMyQuotes, getAllQuotes } from "../controllers/quote.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createQuote);
router.route("/my-quotes").get(verifyJWT, getMyQuotes);
router.route("/all").get(getAllQuotes);

export default router;