import { Router } from "express";
import { addToShelf, getUserShelf, searchBooks , updateProgress , removeFromShelf} from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getRecommendations } from "../controllers/ai.controller.js";

const router = Router();

router.route("/search").get(searchBooks);
router.route('/add-shelf').post(verifyJWT , addToShelf) ;
router.route('/my-shelf').get(verifyJWT , getUserShelf) ;
router.route("/progress").patch(verifyJWT, updateProgress);
router.route("/remove").delete(verifyJWT, removeFromShelf);
router.route("/recommendations").post(verifyJWT, getRecommendations);

export default router;