import { Router } from 'express';
import {
    getAllSemiTrailers,
    getSemiTrailerById,
    createSemiTrailer,
    updateSemiTrailer,
    deleteSemiTrailer,
} from '../controllers/semi-trailer.controller.js';
import { validate } from '../middlewares/validate.js';
import {
    CreateSemiTrailerSchema,
    UpdateSemiTrailerSchema,
    SemiTrailerParamsSchema,
} from '../schemas/semi-trailer.schema.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllSemiTrailers);
router.get('/:id', validate(SemiTrailerParamsSchema), getSemiTrailerById);
router.post('/', validate(CreateSemiTrailerSchema), createSemiTrailer);
router.patch('/:id', validate(UpdateSemiTrailerSchema), updateSemiTrailer);
router.delete('/:id', validate(SemiTrailerParamsSchema), deleteSemiTrailer);

export default router;
