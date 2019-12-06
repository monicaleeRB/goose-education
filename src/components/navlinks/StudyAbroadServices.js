import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link, Menu, MenuItem } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function StudyAbroadServices(props) {
    const { classes } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <div>
            <Button aria-controls="study-abroad-services-dropdown" aria-haspopup="true" onMouseOver={handleClick}>
              Study Abroad Services
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link
                  color="inherit"
                  variant="h6"
                  underline="none"
                  className={classes.rightLink}
                  component={RouterLink} 
                  to=
                  {{
                    pathname: '/studyabroad', 
                    state: {
                      title: 'Study Abroad',
                      selected: 0
                    }
                  }}
                >
                  {'Homestay'}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link
                  color="inherit"
                  variant="h6"
                  underline="none"
                  className={classes.rightLink}
                  component={RouterLink} 
                  to=
                  {{
                    pathname: '/studyabroad', 
                    state: {
                      title: 'Study Abroad',
                      selected: 1
                    }
                  }}
                >
                  {'Airport Ride'}
                </Link>
              </MenuItem>
            </Menu>
        </div>
    );
};

StudyAbroadServices.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default StudyAbroadServices;