import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import api from '../../api/missions/api';

const formatArray = (acc, next) => {
    acc.ids = acc.ids.concat(next._id);
    acc.byId[next._id] = next;
    return acc;
};

const formatData = data => data.reduce(formatArray, { ids: [], byId: {} });

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ids: [],
                byId: {},
            },
            isolatedCountry: {},
            distances: {}
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.setMissionId = this.setMissionId.bind(this);
        this.getClosestAndFarthest = this.getClosestAndFarthest.bind(this);
    }

    componentDidMount() {
        api.fetch({})
            .then((response) => {
                const { data, isolatedCountry } = response;
                this.setMissionId(data[0]._id);
                this.setState(() => ({
                    data: formatData(data),
                    isolatedCountry,
                }), this.getClosestAndFarthest);
            });
    }

    componentDidUpdate(prevProps) {
        const { data } = this.state;
        const { ids } = data;
        const missionsId = this.getMissionId();
        if (missionsId !== prevProps.match.params.missionsId && ids.length) {
            this.getClosestAndFarthest();
        }
    }

    getClosestAndFarthest() {
        const missionsId = this.getMissionId();
        const { data } = this.state;
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

    setMissionId(selected) {
        const { history } = this.props;
        history.push(selected);
    }

    getMissionId() {
        const { match } = this.props;
        return match.params.missionsId;
    }

    handleSelect(e) {
        const { id } = e.currentTarget.dataset;
        this.setMissionId(id);
    }

    render() {
        const { data, isolatedCountry, distances } = this.state;
        return (
            <div>
                <Paper>
                    {
                        data.ids.length > 0 && (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                        <TableCell>Country</TableCell>
                                        <TableCell>Address</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.ids.map(id => (
                                        <TableRow
                                            key={id}
                                            data-id={id}
                                            onClick={this.handleSelect}
                                        >
                                            <TableCell>
                                                {data.byId[id].agent}
                                            </TableCell>
                                            <TableCell>{data.byId[id].country}</TableCell>
                                            <TableCell>{data.byId[id].address}</TableCell>
                                            <TableCell>{data.byId[id].date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )
                    }
                </Paper>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    height: 50,
                    alignItems: 'center'
                }}
                >
                    <div>
                        {data.ids.length} missions
                    </div>
                    {isolatedCountry && (
                        <React.Fragment>
                            <div>
                                Isolated country {isolatedCountry.country}
                                (
                                {isolatedCountry.agents}
                                )
                            </div>
                        </React.Fragment>
                    )}
                    {
                        distances.closest && distances.closest.address && (
                            <React.Fragment>
                                <div>
                                    closest mission: {distances.closest.address} {distances.closest.value}
                                </div>
                                <div>
                                    farthest mission: {distances.farthest.address} {distances.farthest.value}
                                </div>
                            </React.Fragment>
                        )
                    }
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            missionsId: PropTypes.string
        })
    }).isRequired,
    history: PropTypes.shape({}).isRequired
};

export default Dashboard;
