import request from '../request';
import { isolationUrl, closestUrl } from './config';

const api = {
    fetch: params => request.get(`/api${isolationUrl}`, { params })
        .then(res => res.data)
        .catch(error => error),
    post: (body) => {
        const { targetLocation, destinations } = body;
        return request.post(`/api${closestUrl}`, {
            'target-location': targetLocation,
            destinations
        })
            .then(res => res.data)
            .catch(error => error);
    }
};

export default api;
