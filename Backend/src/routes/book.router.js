import { Router } from "express";
import { addToShelf, getUserShelf, searchBooks , updateProgress , removeFromShelf} from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// We might want to protect this route so only logged-in users can search?
// For now, let's keep it open to test easily.

const router = Router();

router.route("/search").get(searchBooks);
router.route('/add-shelf').post(verifyJWT , addToShelf) ;
router.route('/my-shelf').get(verifyJWT , getUserShelf) ;
router.route("/progress").patch(verifyJWT, updateProgress);
router.route("/remove").delete(verifyJWT, removeFromShelf);

export default router;