import React, { useReducer } from 'react';
import { Box, Button, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, LocalOfferOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, MoreVertOutlined, Facebook, Instagram, RoomOutlined, LanguageOutlined } from '@material-ui/icons';
import { ValidatorForm } from 'react-material-ui-form-validator';
import parse from 'html-react-parser';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { withFirebase } from '../components/firebase';
import { EditorValidator } from '../constants/customValidators';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ComposeDialog from '../components/ComposeDialog';
import Comments from '../components/Comments';

const styles = theme => ({
    mt3: {
        marginTop: theme.spacing(3),
    },
    pr1: {
        paddingRight: theme.spacing(1),
    },
    meta: {
      background: theme.palette.secondary.light,
      color: 'rgba(0, 0, 0, 0.54)',
      opacity: 0.9,
    },
    left: {
      float: 'left',
      display: 'flex',
      justifyContent: 'space-evenly'
    },
    right: {
      float: 'right',
      display: 'flex',
    },
    image: {
      display: 'block',
      border: '0',
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
    link: {
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.secondary.main,
        },
    }
});

function toggleReducer(state, action) {
    const { type, payload } = action;
  
    switch(type) {
        case 'NEW_COMMENT': 
            return { ...state, comment: payload }

        case 'OPEN_ACTIONS':
            const anchorKey = (payload.id === 'article') ? 'editAnchor' : 'commentAnchor';
            return { ...state, [anchorKey]: payload }

        case 'CLOSE_ACTIONS':
            return { ...state, editAnchor: null, commentAnchor: null }
        
        case 'CONFIRM_DELETE':
            const confirmKey = (payload.id === 'article') ? 'editConfirmOpen' : 'commentConfirmOpen';
            return { 
                ...state, 
                [confirmKey]: !state[confirmKey],
                ...(!state[confirmKey]) && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
        
        case 'EDIT_CONTENT':
            const dialogKey = (payload.id === 'article') ? 'editDialogOpen' : 'commentDialogOpen';
            return { 
                ...state, 
                [dialogKey]: !state[dialogKey],
                ...(!state[dialogKey]) && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
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

function Article(props) {
    const { authUser, classes, firebase, history, article } = props;

    const INITIAL_STATE = {
        comment: '',
        commentAnchor: null,
        commentDialogOpen: false,
        commentConfirmOpen: false,
        editAnchor: null,
        editDialogOpen: false,
        editConfirmOpen: false
    }
    
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { comment, commentAnchor, commentDialogOpen, commentConfirmOpen, editAnchor, editConfirmOpen, editDialogOpen } = state;
    const commentAnchorOpen = Boolean(commentAnchor);
    const editAnchorOpen = Boolean(editAnchor);

    const redirectPath = () => history.push({ pathname: '/networking', state: { title: 'Networking', selected: 0 } });
    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS' });
    const handleComment = value => dispatch({ type:'NEW_COMMENT', payload:value });
    const handleDeleteConfirmation = event => (event.currentTarget.id) ? dispatch({ type:'CONFIRM_DELETE', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleEdit = event => (event.currentTarget.id) ? dispatch({ type: 'EDIT_CONTENT', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const resetAllActions = () => dispatch({ type:'RESET_ACTIONS' });
    const handleArticleDelete = () => firebase.deleteArticle(article.id).then(() => redirectPath());

    const commentsProps = { formType: 'article', classes, firebase, commentAnchor, commentAnchorOpen, commentDialogOpen, commentConfirmOpen, openPostActions, closePostActions, handleEdit, handleDeleteConfirmation, resetAllActions, selectedResource: article }

    if (!article) return null;
    const isArticleOwner = (!authUser) ? false : isArticleOwner = authUser.uid === article.authorID;
  
    const onSubmit = event => {
      firebase.article(article.id).update({ 
        "comments": firebase.updateArray().arrayUnion({
            id: uuidv4(),
            authorDisplayName: authUser.displayName,
            authorID: authUser.uid,
            description: comment,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }) 
      }).then(() => { 
        handleComment('');
        redirectPath();
    });
      // .catch(error => dispatch({ type: 'error', payload: error }))
      event.preventDefault();
    }

    return (
        <Container className={classes.mt3}>
            <Typography variant='h6' align='left'>{article.title}</Typography>

             {/* M E T A D A T A [author, tag, number of comments, number of views, date created/updated] */}
            <Box px={3} pt={2} pb={4} className={classes.meta}>
                <Box className={classes.left}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <AccountCircleOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>
                                {article.authorDisplayName}
                            </Typography>
                        </Grid>

                        <Grid item >
                            <LocalOfferOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>
                                {article.tag}
                            </Typography>
                        </Grid>

                        <Grid item >
                            <ChatBubbleOutlineOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>
                                {article.comments.length}
                            </Typography>
                        </Grid>

                        <Grid item >
                            <VisibilityOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>
                                {article.views}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box className={classes.right}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <ScheduleOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2'>
                                {article.createdAt && article.updatedAt ? format(article.updatedAt, 'Pp') : format(article.createdAt, 'Pp')}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* C O N T E N T */}
            <img className={classes.image} src={(article.image.includes('firebase')) ? article.image : require(`../assets/img/${article.image}`)} alt="article cover"/>
            
            <Grid container justify='space-between'>
                <Grid item xs={11}>
                    <Typography component='span' variant='body2' align='left' className={classes.mt3}>
                        {parse(article.description)}
                    </Typography>
                </Grid>

                <Grid item>
                    {isArticleOwner &&
                    <>
                        <IconButton id='article' onClick={openPostActions}>
                            <MoreVertOutlined/>
                        </IconButton>
                        <Menu
                            keepMounted
                            anchorEl={editAnchor}
                            open={editAnchorOpen}
                            onClose={closePostActions}
                        >
                            <MenuItem id='article' onClick={handleEdit}>Edit article</MenuItem>
                            <MenuItem id='article' onClick={handleDeleteConfirmation}>Delete article</MenuItem>
                        </Menu>

                         {/* E D I T  &  D E L E T E  F E A T U R E */}
                        <ComposeDialog
                            isEdit={true}
                            article={article}
                            authUser={authUser} 
                            composeType='article'
                            composeOpen={editDialogOpen} 
                            onClose={resetAllActions} 
                        />
                        <DeleteConfirmation deleteType='article' open={editConfirmOpen} handleDelete={handleArticleDelete} onClose={handleDeleteConfirmation}/>
                    </>
                    }
                </Grid>
            </Grid>

            {article.link1 && generateLinks(classes, article.link1)}
            {article.link2 && generateLinks(classes, article.link2)} 

            <Divider light/>

            {/* C O M M E N T S */}
            <Typography variant='body1' align='left' className={classes.description}>
                {article.comments.length} Comments
            </Typography>
            
            {article.comments.length ? 
                article.comments.map((comment, i) => {
                    const isCommentOwner = (!authUser) ? false : authUser.uid === comment.authorID;
                    return <Comments key={i} comment={comment} isCommentOwner={isCommentOwner} {...commentsProps} /> 
                })
                : 
                <Typography>There are currently no comments.</Typography> 
            }
            <br/>
            <ValidatorForm className={classes.mt3} noValidate autoComplete="off" onSubmit={onSubmit}>
                <EditorValidator 
                value={comment} 
                onChange={handleComment}
                validators={['isQuillEmpty']}
                errorMessages={['Cannot submit an empty comment.']}
                {...(!authUser ? {readOnly: true, placeholder:'Please Register or Login to Comment.'} : {} )}/>
                <Button disabled={!authUser} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
            </ValidatorForm>
        </Container>
    )
}

function generateLinks(classes, link) {
    const isFacebook = link.includes('facebook');
    const isInstagram = link.includes('instagram');
    const isMaps = link.includes('map');

    return (
        <Grid container className={classes.link} spacing={1} onClick={() => window.open(link, "_blank")}>
            <Grid item>
                {isFacebook ? <Facebook fontSize='small'/> 
                :
                isInstagram ? <Instagram fontSize='small'/>
                :
                isMaps ? <RoomOutlined fontSize='small'/>
                :
                <LanguageOutlined fontSize='small'/>}
            </Grid>
            <Grid item>
                <Typography variant='body2'>{link}</Typography>
            </Grid>
        </Grid>
    );
}

export default withStyles(styles)(withFirebase(Article));