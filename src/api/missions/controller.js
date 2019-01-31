import _ from 'lodash';

const filterIsolatedAgents = (acc, next) => {
    if (acc[next.agent]) {
        delete acc[next.agent]; // delete agent if he exists already - not isolated
    } else {
        acc[next.agent] = next.country;
    }
    return acc;
};

const findIsolatedAgents = list => list.reduce(filterIsolatedAgents, {});

const countCountryByAgents = (acc, country) => {
    if (!acc[country]) { // count the countries and the count of isolated agents
        acc[country] = 1;
    } else {
        acc[country] += 1;
    }
    return acc;
};

const getIsolatedCountries = data => _.reduce(findIsolatedAgents(data), countCountryByAgents, {});

const getIsolatedCountry = data => _.reduce(getIsolatedCountries(data), (acc, val, key) => {
    if (val > acc.agents) {
        acc.country = key;
        acc.agents = val;
    }
    return acc;
}, {
    country: '',
    agents: 0
});

export { getIsolatedCountry };
