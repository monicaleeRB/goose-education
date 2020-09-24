import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, EditOutlined } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function Announcements(props) {
  const { state, dispatch, listOfAnnouncements, firebase } = props;

  const [ selectedAnnounce, setSelectedAnnounce ] = useState(null);

  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const toggleClickAction = event => {
    const actionType = event.currentTarget.name;
    const announceData = listOfAnnouncements.find(announce => announce.id === event.currentTarget.id);
    setSelectedAnnounce(announceData);
    (actionType === 'edit') ? toggleEditDialog() : toggleDeleteConfirm();
  }

  const onDelete = async () => {
    const deletePromises = [];

    if (selectedAnnounce.attachments) {
      const deleteStorageResource = firebase.refFromUrl(selectedAnnounce.attachments).delete();
      deletePromises.push(deleteStorageResource);
    }

    const deleteDoc =  firebase.deleteTip(selectedAnnounce.id);
    deletePromises.push(deleteDoc);

    try {
      await Promise.all(deletePromises);
      dispatch({type: 'DELETE_CONFIRM'});
      setSnackbarMessage('Tip successfully deleted!');
    } catch (error) {
      console.log(error.message)
    }


    firebase.deleteAnnouncement(selectedAnnounce.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('Announcement deleted successfully!');
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <>
      <AdminComposeDialog 
        isEdit={true} 
        formType="announce" 
        open={state.editDialogOpen} 
        onClose={toggleEditDialog} 
        setSnackbarMessage={setSnackbarMessage} 
        prevContent={selectedAnnounce}/>

      <DeleteConfirmation 
        deleteType='admin_announce' 
        open={state.deleteConfirmOpen} 
        handleDelete={onDelete} 
        onClose={toggleDeleteConfirm}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Last Updated At</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfAnnouncements.map((announce, i) => (
            <TableRow key={i} hover>
              <TableCell>{announce.title}</TableCell>
              <TableCell>{format(announce.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <IconButton name='edit' id={announce.id} color="secondary" onClick={toggleClickAction}>
                  <EditOutlined fontSize="small"/>
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton name='delete' id={announce.id} color="secondary" onClick={toggleClickAction}>
                  <Clear fontSize="small"/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Announcements);