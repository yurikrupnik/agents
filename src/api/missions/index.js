import express from 'express';
import distance from 'google-distance-matrix';
import { isolationUrl, closestUrl } from './config';
import Model from './model';
import { getIsolatedCountry } from './controller';

const route = express.Router();

distance.key('AIzaSyCaG9xbC8uNpFvk9UVpUjYx2N19ZNdHR_E');

const handleError = (res) => {
    const statusCode = 500;
    return err => res.status(statusCode)
        .send(err);
};

route.get(isolationUrl, (req, res) => Model.find()
    .then((data) => {
        const isolatedCountry = getIsolatedCountry(data);
        return res.status(200)
            .json({
                data,
                isolatedCountry
            });
    })
    .catch(handleError(res)));

route.post(closestUrl, (req, res) => {
    const targetLocation = req.body['target-location'];
    const { destinations } = req.body;
    distance.matrix(targetLocation, destinations, (err, response) => {
        if (err) {
            handleError(res)(err);
        } else {
            res.json(response);
        }
    });
});

export default route;
