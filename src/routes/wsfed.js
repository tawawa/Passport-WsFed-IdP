import express, { Router } from 'express';
import passportMiddleware from '../passportMiddleware';
import wsfed from '../wsfedAsync';

const router = Router();

router.get('/FederationMetadata/2007-06/FederationMetadata.xml', wsfed.metadata);
router.get('/', passportMiddleware, wsfed.auth);
router.use(wsfed.sendError);

export default router;