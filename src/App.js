import React, { useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import './App.css';

// Page Components
import ScrollToTop from './components/ScrollToTop';
import Home from './Home';
import Goose from './GooseStudyAbroad';
import Networking from './Networking';
import Schools from './Schools';
import StudyAbroad from './StudyAbroadServices';
import ServiceCentre from './ServiceCentre';
import Privacy from './Privacy';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Profile from './Profile';
import EditProfile from './EditProfile';
import Search from './Search';

// React Context Components
import { withAuthentication } from './components/session';
import { DatabaseContext, withFetching } from './components/database';
import { ValidatorForm } from 'react-material-ui-form-validator';

function App() {
  // custom validation to check if <ReactQuill> component is empty -or- is only HTML tags (accessible as 'isQuillEmpty' rule)
  useEffect(() => {
    ValidatorForm.addValidationRule('isQuillEmpty', value => {
        if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        return false;
        }
        return true;
    });
  }, []);

  return (
    <div className="App">
      <ScrollToTop>
        <Switch>
          <Route path="/search" render={props => <Search {...props} />}/>
          <Route path="/profile/edit" render={props => <EditProfile {...props} />}/>
          <Route path="/profile" render={() => <Profile/>}/>
          <Route path="/forgotpassword" render={() => <ForgotPassword/>}/>
          <Route path="/login" render={() => <Login/>}/>
          <Route path="/register" render={() => <Register/>}/>
          <Route path="/privacy" render={() => <Privacy/>}/>
          <Route path="/services" render={props => <ServiceCentre {...props} />}/>
          <Route path="/studyabroad" render={props => <StudyAbroad {...props} />}/>
          <Route path="/schools" 
            render={props => 
              <DatabaseContext.Consumer>
                {context => <Schools {...props} listOfSchools={context.listOfSchools}/> }
              </DatabaseContext.Consumer>
            }
          />
          <Route path="/networking" render={props => <Networking {...props} />}/>
          <Route path="/goose" render={props => <Goose {...props} />}/>
          <Route exact path="/" render={() => <Home /> }/>
        </Switch>
      </ScrollToTop>
    </div>
  );
}

export default withAuthentication(withFetching(App));
