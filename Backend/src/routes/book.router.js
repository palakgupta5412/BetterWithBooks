import { Router } from "express";
import { addToShelf, getUserShelf, searchBooks , updateProgress} from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// We might want to protect this route so only logged-in users can search?
// For now, let's keep it open to test easily.

const router = Router();

// URL will be: /api/v1/books/search?query=bookname
router.route("/search").get(searchBooks);
router.route('/add-shelf').post(verifyJWT , addToShelf) ;
router.route('/my-shelf').get(verifyJWT , getUserShelf) ;
router.route("/progress").patch(verifyJWT, updateProgress);

export default router;