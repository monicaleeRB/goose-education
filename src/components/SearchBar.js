import React from 'react';
import { Button, InputAdornment, InputBase, withStyles } from '@material-ui/core';

const styles = theme => ({
    search: {
        float: 'right',
        border: `2px solid ${theme.palette.secondary.main}`,
        borderRadius: '5px',
        paddingLeft: theme.spacing(1),
    },
    searchButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.secondary.main,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
});

function SearchBar(props) {
    const { classes } = props;

    return (
        <>
            <InputBase
                className={classes.search}
                placeholder="Enter a search term"
                endAdornment={
                    <InputAdornment>
                        <Button className={classes.searchButton}>
                            Search
                        </Button>
                    </InputAdornment>
                }
            />
        </>
    )
}

export default withStyles(styles)(SearchBar);