import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, LinearProgress, withStyles } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Typography from '../components/onePirate/Typography';
import { AuthUserContext } from '../components/session';
import { withFirebase } from '../components/firebase';
import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SearchField from '../components/SearchField';
import ArticleDialog from '../components/ArticleDialog';
import Pagination from '../components/Pagination';

const styles = theme => ({
    root: {
        overflow: 'hidden',
    },
    image: {
        display: 'block',
        border: 0,
        width: 'auto',
        maxWidth: '100%',
        height: 'auto',
        margin: '0 auto',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3, 5),
        textAlign: 'left',
        "&:hover": {
            cursor: 'pointer',
        },
    },
    title: {
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1, 0),
    },
    articleTitle: {
        fontWeight: 700,
    },
    articleDescription: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '23em',
    },
    search: {
        float: 'right',
        border: `2px solid ${theme.palette.secondary.main}`,
        borderRadius: 5,
        paddingLeft: theme.spacing(1),
    },
    searchButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.secondary.main,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    filterButton: {
        float: 'left',
        color: theme.palette.primary.light,
        border: `2px solid ${theme.palette.primary.light}`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
    badge: {
        backgroundColor: 'rgb(240, 150, 20)',
        color: theme.palette.common.white,
        padding: 3,
        width: '4em',
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});

function toggleReducer(state, action) {
    let { type, payload } = action;
  
    switch(type) {
        case 'FETCH_INIT': 
            return { ...state, isLoading: true }

        case 'FETCH_TIPS':
            return { ...state, isLoading: false, gooseTips: payload }
        
        case 'OPEN_COMPOSE':
            return { ...state, composeOpen: true }

        case 'CLOSE_COMPOSE':
            return { ...state, composeOpen: false }

        case 'OPEN_FILTER':
            return { ...state, filterOpen: true }
        
        case 'CLOSE_FILTER':
            return { ...state, filterOpen: false }
        
        case 'OPEN_SORT':
            return { ...state, anchorOpen: payload }
        
        case 'CLOSE_SORT':
            return { ...state, anchorOpen: null }

        case 'SEARCH_QUERY':
            const searchQuery = payload.value;
            return { ...state, searchQuery }
        
        case 'OPEN_TIP':
            let selectedTip = state.gooseTips.find(tip => tip.id.toString() === payload.id);
        return { 
            ...state, 
            selectedTip,
            tipOpen: true, 
        }
        
        case 'CLOSE_TIP':
            return { ...state, tipOpen: false, selectedTip: null }
        
        case 'CHANGE_PAGE':
            const currentPage = payload;
            return { ...state, currentPage }
    }
}

function GooseTipsBase(props) {
    const { classes, firebase, history } = props;
    
    const INITIAL_STATE = {
        isLoading: false,
        gooseTips: [],
        composeOpen: false,
        filterOpen: false,
        anchorOpen: null,
        tipOpen: false,
        selectedTip: null,
        searchQuery: '',
        currentPage: 0,
        tipsPerPage: 10
    }
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { gooseTips, filterOpen, anchorOpen, tipOpen, selectedTip, searchQuery, currentPage, tipsPerPage } = state;

    const totalTips = gooseTips.length;
    const totalPages = Math.ceil(totalTips / tipsPerPage);
    const indexOfLastTip = (currentPage * tipsPerPage) + 1;
    const indexOfFirstTip = indexOfLastTip - tipsPerPage;
    const paginatedTips = (totalPages > 1) ? gooseTips.slice(indexOfFirstTip, indexOfLastTip) : gooseTips;

    useEffect(() => {
        ValidatorForm.addValidationRule('isQuillEmpty', value => {
            if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
            return false;
            }
            return true;
        });

        dispatch({ type: 'FETCH_INIT' });
        const findAllTips = () => {
            const tipsQuery = firebase.tips().get();
            tipsQuery.then(snapshot => {
              if (snapshot.empty) {
                console.log('No matching documents.');
                return;
              }  
          
              let gooseTips = [];
              snapshot.forEach(doc => {
                gooseTips.push(doc.data());
              });
              dispatch({ type: 'FETCH_TIPS', payload: gooseTips });
    
            })
            .catch(err => {
              console.log('Error getting documents', err);
            });
        }

        findAllTips();
    }, []);
    

    return (
        <section className={classes.root}>
            <Container>
                <Typography variant="h3" marked="center" className={classes.title}>Goose Tips</Typography>
                <Filter handleFilterClick={() => dispatch({ type: 'OPEN_FILTER' })}/>
                <Sort handleSortClick={event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget })}/>
                <SearchField 
                    handleSearch={event => dispatch({type: 'SEARCH_QUERY', payload: event.target})}
                    handleSearchClick={() => history.push({pathname:'/search', search:`?query=${searchQuery}`, state: {...state, resources: gooseTips} })}/>

                <FilterDialog filterOpen={filterOpen} onClose={() => dispatch({ type: 'CLOSE_FILTER' })} />
                <SortPopover anchorEl={anchorOpen} open={Boolean(anchorOpen)} onClose={() => dispatch({ type: 'CLOSE_SORT'})}/>
                <AuthUserContext.Consumer>
                    { authUser => authUser ?
                        <ArticleDialog  
                        authUser={authUser} 
                        history={history}
                        articleOpen={tipOpen}
                        article={selectedTip}
                        onClose={() => dispatch({ type: 'CLOSE_TIP' })}/>
                    : '' }
                </AuthUserContext.Consumer>

                { gooseTips.length ? 
                    <Grid container>
                        { paginatedTips.map(tip => {
                            return (
                                <Grid item xs={12} md={4} key={tip.id} className={classes.background}>
                                    <div id={tip.id} onClick={event => dispatch({ type: 'OPEN_TIP', payload: event.currentTarget })} className={classes.item}>
                                        <img
                                            className={classes.image}
                                            src={require(`../assets/img/${tip.image}`)}
                                            alt="tip-thumbnail"
                                        />
                                        <div className={classes.body}>
                                            {(tip.views > 100) ? <Typography className={classes.badge}>Hot</Typography> : ''}
                                            <Typography variant="body1" className={classes.articleTitle}>
                                                {tip.title}
                                            </Typography>
                                            <Typography noWrap variant="body2" className={classes.articleDescription}>
                                                {tip.description}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                            )
                        }) }
                    </Grid>
                    : 
                    <LinearProgress color='secondary'/>
                    }
                    <Pagination 
                    totalPages={totalPages}
                    currentPage={currentPage} 
                    resourcesPerPage={tipsPerPage}
                    handlePageChange={(event, newPage) => dispatch({type:'CHANGE_PAGE', payload: newPage})}
                    />
            </Container>
        </section>
    );
}

GooseTipsBase.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withFirebase(GooseTipsBase));