import { Router } from 'express';
import {validate} from "../middlewares/validate.js";
import { RegisterSchema, LoginSchema } from "../schemas/user.schema.js";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', validate(RegisterSchema), register);
router.post('/login', validate(LoginSchema), login);

export default router;