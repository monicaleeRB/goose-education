import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import withRoot from './withRoot';
import { TAGS } from './constants/constants';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import { DatabaseContext } from './components/database';
import MarkedTypography from './components/onePirate/Typography';
import TabPanel from './components/TabPanel';
import PageBanner from './views/PageBanner';
import ArticleBoard from './views/ArticleBoard';
import Poster from './components/Poster';
import { useStyles } from './styles/networking';

function Networking(props) {
  const classes = useStyles();
  const { pageBanner, poster, posterCards, wrapper } = props;

  const [ selectedTab, setSelectedTab ] = useState(props.location.state.selected);
  
  const theme = useTheme();
  const xsBreakpoint = useMediaQuery(theme.breakpoints.down('xs'));
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  const posterBody = {
    title: poster.title,
    subtitle: poster.subtitle,
    caption: poster.caption,
  }

  return (
    <>
      {ResponsiveNavBars(mdBreakpoint)}
      <PageBanner title={pageBanner.title} backgroundImage={pageBanner.image} layoutType='headerBanner'/>

      <Box className={classes.header}>
        <MarkedTypography variant={!xsBreakpoint ? "h3" : "h4"} marked="center" className={classes.headerTitle}>{wrapper.title}</MarkedTypography>
        <Typography className={classes.headerDescription}>{wrapper.caption}</Typography>
      </Box>

      <Box>
        {!xsBreakpoint &&
          <Tabs
            value={selectedTab}
            onChange={(event, value) => setSelectedTab(value)}
            textColor="secondary"
            variant='fullWidth'
          >
            {TAGS.map(tab => {
              return <Tab key={tab.toLowerCase()} label={tab}/> 
            })}
          </Tabs>
        }

        <DatabaseContext.Consumer>
          {({ state }) => {
            const tabArticles = state.taggedArticles[selectedTab];
            return (!xsBreakpoint ? 
                createTabPanel(classes, selectedTab, tabArticles) 
                : 
                <ArticleBoard listOfArticles={tabArticles}/>
            )}
          }
        </DatabaseContext.Consumer>
      </Box>

      <Poster body={posterBody} backgroundImage={poster.image} posterCards={posterCards} layoutType='vancouver_now'/>
      
      {ResponsiveFooters(smBreakpoint)}
    </>
  );
}

function createTabPanel(classes, selectedTab, tabArticles) {
  return (
    <TabPanel className={classes.panel} value={selectedTab} index={selectedTab} key={selectedTab}>
      {tabArticles && tabArticles.length ? 
        <ArticleBoard listOfArticles={tabArticles}/> 
        : 
        <Typography variant='subtitle1'>There are currently no articles on this topic.</Typography> 
      }
    </TabPanel>
  )
}

export default withRoot(Networking);