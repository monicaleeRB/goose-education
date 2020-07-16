import React, { useState } from 'react';
import { Button, MenuItem } from '@material-ui/core';
import { StyledMenu, LinkButton } from '../customMUI';

function StudyAbroad(classes) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onMouseOver={handleClick}>Study Abroad</Button>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ 
          onClick: handleClose, 
          onMouseLeave: handleClose,
        }}>
        <MenuItem className={classes.navlinkItem}>
          <LinkButton 
            to={{ pathname: '/goose', state: { selected: 0 } }}
            label='Goose Study Abroad'/>
        </MenuItem>
        <MenuItem className={classes.navlinkItem}>
          <LinkButton 
            to={{ pathname: '/goose', state: { selected: 1 } }}
            label='Goose Tips'/>
        </MenuItem>
      </StyledMenu>
    </>
  );
};

export default StudyAbroad;