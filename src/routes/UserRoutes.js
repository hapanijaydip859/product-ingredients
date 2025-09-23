import express from "express";
import { createUser, userFind } from "../controller/UserController.js";




const router = express.Router();


router.post('/create', createUser)
router.get('/find', userFind)

export const getuserdata = router;