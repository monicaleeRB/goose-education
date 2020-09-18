import React, { useReducer, useState } from 'react';
import { Box, Button, Collapse, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, ScheduleOutlined, MoreVertOutlined, Facebook, Instagram, RoomOutlined, LanguageOutlined, EditOutlined, DeleteOutline } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import { format, compareDesc } from 'date-fns';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { MuiThemeBreakpoints } from '../constants/constants';
import { withFirebase } from '../components/firebase';
import Comments from '../components/Comments';
import ComposeDialog from '../components/ComposeDialog';
import DeleteConfirmation from '../components/DeleteConfirmation';
import StyledValidators from '../components/customMUI';
import ErrorSnackbar from '../components/ErrorSnackbar';
import useStyles from '../styles/serviceCentre.js';

const INITIAL_STATE = {
    comment: '',
    commentCollapseOpen: false,
    editAnchor: null,
    editDialogOpen: false,
    editConfirmOpen: false
}

function Announcement(props) {
    const classes = useStyles(props);
    const history = useHistory();
    const xsBreakpoint = MuiThemeBreakpoints().xs;
    const { authUser, firebase, selectedAnnounce } = props;
    const isLoggedInAdmin = authUser && authUser.roles['admin'];

    const [ error, setError ] = useState(null);
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { comment, commentCollapseOpen, editAnchor, editConfirmOpen, editDialogOpen } = state;
    const editAnchorOpen = Boolean(editAnchor);

    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS' });
    const handleComment = e => dispatch({ type:'NEW_COMMENT', payload: e.currentTarget.value });
    const handleDeleteConfirmation = event => (event.currentTarget.id) ? dispatch({ type:'CONFIRM_DELETE', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleEdit = event => (event.currentTarget.id) ? dispatch({ type: 'EDIT_CONTENT', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleCollapse = () => { dispatch({ type: 'TRIGGER_COLLAPSE' })}
    const resetAllActions = () => dispatch({ type:'RESET_ACTIONS' });
    const handleAnnounceDelete = () => firebase.deleteArticle(selectedAnnounce.id).then(() => redirectPath());

    const redirectPath = () => history.push({ 
        pathname: '/services', state: { title: 'Service Centre', tab: 0 }});

    const onCommentSubmit = event => {
        firebase.announcement(selectedAnnounce.id).update({ 
            'comments': firebase.updateArray().arrayUnion({
                id: uuidv4(),
                authorDisplayName: authUser.displayName,
                authorID: authUser.uid,
                description: comment,
                createdAt: Date.now(),
                updatedAt: Date.now()
        })})
        .then(() => { redirectPath() })
        .catch(error => setError(error.message));
        event.preventDefault();
    }

    const CommentFormField = 
    <ValidatorForm onSubmit={onCommentSubmit}>
        <StyledValidators.TextField
            multiline
            rows={5}
            value={comment}
            onChange={handleComment}
            validators={['isQuillEmpty']}
            errorMessages={['']}/>
        <Button className={classes.commentButton} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
    </ValidatorForm>
    
    return (
        <Container>
            {error && 
                <ErrorSnackbar 
                isOpen={!!error}
                onCloseHandler={() => setError(null)}
                errorMessage={error}/>}

            <Typography className={classes.title}>{selectedAnnounce.title}</Typography>

            <Grid container className={classes.metaContainer}>
                <Grid container item xs={7} sm={6} spacing={1} className={classes.metaLeft}>
                    <Grid item><AccountCircleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{selectedAnnounce.authorDisplayName}</Typography>
                    </Grid>

                    <Grid item><ChatBubbleOutlineOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{selectedAnnounce.comments.length}</Typography>
                    </Grid>
                    
                    {selectedAnnounce.link1 && generateLinks(classes, selectedAnnounce.link1)}
                    {selectedAnnounce.link2 && generateLinks(classes, selectedAnnounce.link2)}
                </Grid>

                <Grid container item xs={5} sm={6} spacing={1} className={classes.metaRight}>
                    <Grid item><ScheduleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>
                            {format([selectedAnnounce.createdAt, selectedAnnounce.updatedAt].sort(compareDesc).pop(), 'P')}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {!xsBreakpoint ?
            <>
                <Box py={3}>{parse(selectedAnnounce.description)}</Box>

                {isLoggedInAdmin &&
                    <Grid container className={classes.announceActions}>
                        <Grid item sm={4}>
                            <Button onClick={handleCollapse} fullWidth className={classes.announceButtons}>
                                <ChatBubbleOutlineOutlined/>
                            </Button>
                        </Grid>
                        <Grid item sm={4}>
                            <Button id='announce' onClick={handleEdit} fullWidth className={classes.announceButtons}>
                                <EditOutlined/>
                            </Button>
                        </Grid>
                        <Grid item sm={4}>
                            <Button id='announce' onClick={handleDeleteConfirmation} fullWidth className={classes.announceButtons}>
                                <DeleteOutline/>
                            </Button>
                        </Grid>
                    </Grid>
                }
            </> 
            : 
            <Grid container className={classes.announceContainer}>
                {!isLoggedInAdmin ? 
                    <Grid item>{parse(selectedAnnounce.description)}</Grid>
                :
                <>
                    <Grid item xs={9}>{parse(selectedAnnounce.description)}</Grid>
                    <Grid item>
                        <IconButton id='announce' onClick={openPostActions}>
                            <MoreVertOutlined/>
                        </IconButton>
                    </Grid>
                </>
                }
            </Grid>
            }

            {/* Conditional Components - Edit + Delete Features */}
            <Menu
                keepMounted
                anchorEl={editAnchor}
                open={editAnchorOpen}
                onClose={closePostActions}>
                <MenuItem id='announce' onClick={handleEdit}>Edit</MenuItem>
                <MenuItem id='announce' onClick={handleDeleteConfirmation}>Delete</MenuItem>
            </Menu>

             <ComposeDialog
                isEdit={true}
                article={selectedAnnounce}
                authUser={authUser} 
                composeType='announce'
                composeOpen={editDialogOpen} 
                onClose={resetAllActions}/>
            
            <DeleteConfirmation 
                deleteType='admin_announce' 
                open={editConfirmOpen} 
                handleDelete={handleAnnounceDelete} 
                onClose={handleDeleteConfirmation}/>

            <Divider light/>

            <Typography className={classes.commentHeader}>
                {selectedAnnounce.comments.length} Comments
            </Typography>

            {
                !authUser ? 
                <Typography>Please login/register to post comments.</Typography>
                :
                !xsBreakpoint && isLoggedInAdmin ? 
                    <Collapse in={commentCollapseOpen} timeout="auto" unmountOnExit>
                        {CommentFormField}
                    </Collapse>
                :
                CommentFormField
            }

            {!!selectedAnnounce.comments.length && 
                <Comments 
                    formType='announcement'
                    authUser={authUser}
                    selectedResource={selectedAnnounce}
                    listOfComments={selectedAnnounce.comments}/> 
            }
        </Container>
    )
}

function generateLinks(classes, link) {
    const isFacebook = link.includes('facebook');
    const isInstagram = link.includes('instagram');
    const isMaps = link.includes('map');

    return (
        <Grid item>
            <IconButton className={classes.announceSocialButtons} onClick={() => window.open(link, "_blank")}>
                {isFacebook ? <Facebook fontSize='small'/> 
                :
                isInstagram ? <Instagram fontSize='small'/>
                :
                isMaps ? <RoomOutlined fontSize='small'/>
                :
                <LanguageOutlined fontSize='small'/>}
            </IconButton>
        </Grid>
    );
}

function toggleReducer(state, action) {
    const { type, payload } = action;
  
    switch(type) {
        case 'NEW_COMMENT': 
        return { ...state, comment: payload }

        case 'OPEN_ACTIONS':
            return { ...state, editAnchor: payload }

        case 'CLOSE_ACTIONS':
            return { ...state, editAnchor: null, commentAnchor: null }
        
        case 'TRIGGER_COLLAPSE':
            return { ...state, commentCollapseOpen: !state.commentCollapseOpen}
        
        case 'CONFIRM_DELETE':
            return { 
                ...state, 
                editConfirmOpen: !state.editConfirmOpen,
                ...!state.editConfirmOpen && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
        
        case 'EDIT_CONTENT':
            return { 
                ...state, 
                editDialogOpen: !state.editDialogOpen,
                ...!state.editDialogOpen && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
        
        case 'RESET_ACTIONS': {
            return { 
                ...state, 
                commentAnchor: null,
                commentConfirmOpen: false,
                commentDialogOpen: false,
                editAnchor: null,
                editConfirmOpen: false,
                editDialogOpen: false
            }
        }

        default:
    }
}

export default withFirebase(Announcement);