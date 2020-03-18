import React, { useReducer, Fragment } from "react";
import { Link, Snackbar, Typography, makeStyles } from "@material-ui/core";
import Title from "./Title";
import Accounts from '../admin/Accounts';
import Schools from '../admin/Schools';
import Applications from '../admin/Applications';

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

function preventDefault(event) {
  event.preventDefault();
}


function toggleReducer(state, action) {
  const { type, payload } = action;

  switch(type) {
    case 'MENU_OPEN': {
      const anchorKey = payload.key;
      const selectedMenu = payload.selected;
      return {...state, [anchorKey]: selectedMenu}
    }
    
    case 'MENU_CLOSE': {
      const anchorKey = payload.key;
      const { firebase, selectedRole, uid } = payload;

      if (selectedRole === 'supervisor') {
        firebase.user(uid).update({
          roles: { [selectedRole]: true }
        });

      } else if (selectedRole === 'user') {
        firebase.user(uid).update({
          roles: {}
        });
      }

      return {...state, [anchorKey]: null}
    }

    case 'TOGGLE_DIALOG':
      // const dialogKey = (payload.id === 'announce') ? 'editDialogOpen' : 'commentDialogOpen';
      return {...state, composeDialogOpen: !state.composeDialogOpen}
    
    case 'DELETE_CONFIRM':
      return {...state, deleteConfirmOpen: !state.deleteConfirmOpen}
    
    case 'SNACKBAR_OPEN':
      return {...state, snackbarOpen: !state.snackbarOpen, snackbarMessage: payload}
  }
}

function createContentTable(state, dispatch, type, content) {
  const props = { state, dispatch, content };

  switch(type) {
    case "accounts": 
      return <Accounts {...props}/>
    
    case "schools":
    return <Schools {...props}/>

    case "applications":
      return <Applications {...props}/>

    default:
      return <Typography>(⁄ ⁄•⁄ω⁄•⁄ ⁄)</Typography>
  }
}

function TableTemplate(props) {
  const { type, listOfResources } = props;
  const classes = useStyles();

  const INITIAL_STATE = {
    anchorUserRole: null,
    deleteConfirmOpen: false,
    snackbarOpen: false,
    snackbarMessage: null,
    composeDialogOpen: false
  }

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});

  return (
    <Fragment>
      <Title>{type}</Title>
      {createContentTable(state, dispatch, type, listOfResources)}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={state.snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarMessage(null)}
        message={state.snackbarMessage}
      />

      <div className={classes.seeMore}>
        {/* create "load more" feature */}
        <Link color="secondary" href="#" onClick={preventDefault}>
          See more {type}
        </Link>
      </div>
    </Fragment>
  );
}

export default TableTemplate;