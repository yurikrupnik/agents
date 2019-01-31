import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MissionsConsumer from '../../api/missions/consumer';

const Container = props => (
    <MissionsConsumer
        {...props}
        render={(missionProps) => {
            const {
                data, isolatedCountry, distances, handleSelect
            } = missionProps;
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
                                                onClick={handleSelect}
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
                                        closest
                                        mission: {distances.closest.address} {distances.closest.value}
                                    </div>
                                    <div>
                                        farthest
                                        mission: {distances.farthest.address} {distances.farthest.value}
                                    </div>
                                </React.Fragment>
                            )
                        }
                    </div>
                </div>
            );
        }}
    />
);

export default Container;
