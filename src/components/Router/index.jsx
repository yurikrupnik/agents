import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const Router = ({ routes }) => (
    <Fragment>
        {routes.map(route => <Route key={route.key} {...route} />)}
    </Fragment>
);

Router.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string.isRequired
    })).isRequired
};

export default Router;
