import express from 'express';
import missions from './missions';

const route = express.Router();

route.use('/api', [
    missions
]);

export default route;
