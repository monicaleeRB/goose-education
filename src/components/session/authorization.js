import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AuthUserContext from './context';
import { withFirebase } from '../firebase';

const withAuthorization = condition => Component => {
    function WithAuthorizationComponent(props) {        
        
        useEffect(() => {
            props.firebase.auth.onAuthStateChanged(authUser => {
                if (!condition(authUser)) {
                    props.history.push('/');
                }
            });
        });
        
        return (
            <AuthUserContext.Consumer>
                { authUser => condition(authUser) ? <Component {...props} /> : null }
            </AuthUserContext.Consumer>
        );
    }
    return withRouter(withFirebase(WithAuthorizationComponent));
}

export default withAuthorization;