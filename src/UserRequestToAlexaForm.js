import React, { Component } from 'react';

const DEFAULT_PLACEHOLDER_VALUE = require('./Constants');
/*
The input component where user's type in their requests for Alexa
*/
class UserRequestToAlexaForm extends Component {
    render() {
        return (
            <form onSubmit={(e) => this.props.onSubmit(e)}>
                <input type="text" value={this.props.value} onChange={(e) => this.props.onChange(e)}
                    placeholder={DEFAULT_PLACEHOLDER_VALUE}
                    className="request-input"
                />
            </form>
        );
    }
}

export default UserRequestToAlexaForm;