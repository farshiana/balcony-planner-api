import { Router } from 'express';
import { addImage } from './images.controller';
import { checkAdmin } from '../../middlewares/auth.middleware';

const router = Router();
router.route('/')
    .post(checkAdmin, addImage);

export default router;
