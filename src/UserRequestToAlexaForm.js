import React from 'react';

const DEFAULT_PLACEHOLDER_VALUE = require('./Constants');
/*
The input component where user's type in their requests for Alexa
*/

const UserRequestToAlexaForm = (props) => {
    return (
        <form onSubmit={(e) => props.onSubmit(e)}>
            <input type="text" value={props.value} onChange={(e) => props.onChange(e)}
                placeholder={DEFAULT_PLACEHOLDER_VALUE}
                className="request-input"
            />
        </form>
    );
}

export default UserRequestToAlexaForm;