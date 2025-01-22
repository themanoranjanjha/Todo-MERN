import {createTodo, getTodos, getTodo, updateTodo, deleteTodo, todoCoplete} from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route('/create').post(verifyJWT, createTodo).get(getTodos);
router.route('/gettodos').get(verifyJWT ,getTodos);
router.route('/update/:id').put(verifyJWT ,updateTodo);
router.route('/delete/:id').delete(verifyJWT, deleteTodo);
router.route('/complete/:id').put(verifyJWT, todoCoplete);
router.route('/:id').get(verifyJWT, getTodo);

export default router;