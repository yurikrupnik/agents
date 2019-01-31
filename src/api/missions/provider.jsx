import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from './context';
import api from './api';

const formatArray = (acc, next) => {
    acc.ids = acc.ids.concat(next._id);
    acc.byId[next._id] = next;
    return acc;
};

const formatData = data => data.reduce(formatArray, { ids: [], byId: {} });

const toggleLoading = prevState => ({ loading: !prevState.loading });

class MissionsProvider extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: {
                ids: [],
                byId: {},
            },
            isolatedCountry: {},
            loading: false,
            missionsId: '',
            distances: {}
        };
        this.fetch = this.fetch.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.toggleCallback = this.toggleCallback.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
        this.setMissionId = this.setMissionId.bind(this);
        this.getClosestAndFarthest = this.getClosestAndFarthest.bind(this);
    }


    componentDidMount() {
        this.fetch();
    }

    componentDidUpdate(prevProps, prevState) {
        const { data, missionsId } = this.state;
        const { ids } = data;
        if (missionsId !== prevState.missionsId && ids.length) {
            this.getClosestAndFarthest();
        }
    }

    getClosestAndFarthest() {
        const { data, missionsId } = this.state;
        const { byId } = data;
        const target = byId[missionsId];
        const targetLocation = [target.address];

        const destinations = Object.values(byId)
            .reduce((acc, val) => {
                if (val._id === missionsId) {
                    return acc;
                }
                return acc.concat(val.address);
            }, []);

        api.post({
            targetLocation,
            destinations
        })
            .then((res) => {
                const { elements } = res.rows[0];
                const distances = elements.reduce((acc, next, i) => {
                    const { status, distance } = next;
                    if (status === 'OK') {
                        const { value } = distance;
                        if (!acc.farthest.value && !acc.closest.value) {
                            acc.farthest.value = value;
                            acc.farthest.address = destinations[i];
                            acc.closest.value = value;
                            acc.closest.address = destinations[i];
                        }

                        if (value > acc.farthest.value) {
                            acc.farthest.value = value;
                            acc.farthest.address = destinations[i];
                        }

                        if (value < acc.closest.value) {
                            acc.closest.value = value;
                            acc.closest.address = destinations[i];
                        }
                    }
                    return acc;
                }, {
                    farthest: {},
                    closest: {}
                });
                this.setState(() => {
                    return {
                        distances
                    };
                });
            });
    }

    setMissionId(missionsId) {
        this.setState(({ missionsId }));
    }

    handleSelect(e) {
        const { id } = e.currentTarget.dataset;
        this.setMissionId(id);
    }

    fetch(params, cb) {
        this.setState(toggleLoading, this.toggleCallback(params, cb));
    }

    toggleCallback(params, cb) {
        return () => api.fetch(params)
            .then((response) => {
                const { data, isolatedCountry } = response;
                this.setState(prevState => ({
                    data: formatData(data),
                    missionsId: data[0]._id,
                    loading: !prevState.loading,
                    isolatedCountry
                }), cb);
            })
            .catch((error) => {
                this.setState(prevState => ({
                    error,
                    loading: !prevState.loading
                }));
            });
    }

    setSelected(selected) {
        this.setState(() => ({ selected }));
    }

    render() {
        const { children } = this.props;
        return (
            <Provider value={{
                ...this.state,
                fetch: this.fetch,
                handleSelect: this.handleSelect
            }}
            >
                {children}
            </Provider>
        );
    }
}

MissionsProvider.propTypes = {
    children: PropTypes.element.isRequired,
};

export default MissionsProvider;
