import React, { useState } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";

import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SocialMediaButtons from '../components/SocialMediaButtons';
import Pagination from '../components/Pagination';

const title = 'Study Abroad Counselling';
const description = 'We will respond to your inquiry within 24 hours.';

const styles = theme => ({
    wrapper: {
        marginTop: theme.spacing(3),
    },
});

function MessageBoard(props) {
    const { messagesDB, handleClick, classes } = props;
    let match = useRouteMatch();

    const [state, setState] = useState({
        filterOpen: false,
        anchorEl: null,
    });

    const { filterOpen, anchorEl } = state;

    // COMPONENTS > Filter Dialog Modal 
    const handleFilterClick = () => setState({...state, filterOpen: true});
    const handleFilterClose = () => setState({...state, filterOpen: false});
    
    // // COMPONENTS > Sort Popover
    const handleSortClick = event => setState({...state, anchorEl: event.currentTarget});
    const handleSortClose = () => setState({...state, anchorEl: null});

    return (
        <Container>
            <SocialMediaButtons title={title} description={description}/>
            <div className={classes.wrapper}>
                <Filter handleFilterClick={handleFilterClick}/>
                <Sort handleSortClick={handleSortClick}/>
            </div>
            <FilterDialog filterOpen={filterOpen} onClose={handleFilterClose} />
            <SortPopover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleSortClose}/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Title</TableCell>
                        <TableCell align='center'>Author</TableCell>
                        <TableCell align='center'>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {messagesDB.map(message => {
                        return (
                            <TableRow hover key={message.id} id={message.id} onClick={handleClick}>
                                <TableCell align='center'>
                                    <Link
                                        color="inherit"
                                        underline="none"
                                        component={RouterLink} 
                                        to=
                                        {{
                                            pathname: `${match.path}/message/${message.id}`, 
                                            state: {
                                                title: 'Service Centre',
                                                selected: 0,
                                            }
                                        }}
                                    >
                                        {message.title}
                                    </Link>
                                </TableCell>
                                <TableCell align='center'>{message.author}</TableCell>
                                <TableCell align='center'>{message.date}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination />
        </Container>
    )
}

export default withStyles(styles)(MessageBoard);