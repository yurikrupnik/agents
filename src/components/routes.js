import Missions from './Missions';
import Dashboard from './Dashboard';

const routes = [
    {
        path: '/:missionsId?',
        component: Missions,
        key: 'dashboard'
    }
];

export default routes;
