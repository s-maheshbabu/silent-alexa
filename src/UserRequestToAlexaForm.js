import React from 'react';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const DEFAULT_PLACEHOLDER_VALUE = require('./Constants');
/*
The input component where user's type in their requests for Alexa
*/

const UserRequestToAlexaForm = (props) => {
    return (
        <form onSubmit={(e) => props.onSubmit(e)}>
            <MuiThemeProvider>
                <TextField
                    id="user-request-to-alexa-text-field"
                    hintText={DEFAULT_PLACEHOLDER_VALUE}
                    value={props.value}
                    onChange={(e) => props.onChange(e)}
                />
            </MuiThemeProvider>
        </form>
    );
}

export default UserRequestToAlexaForm;