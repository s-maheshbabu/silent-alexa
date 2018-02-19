import React, { Component } from 'react';

/*
The input component where user's type in their requests for Alexa
*/
class UserRequestToAlexaForm extends Component {
    render() {
        return (
            <form onSubmit={(e) => this.props.onSubmit(e)}>
                <input type="text" value={this.props.value} onChange={(e) => this.props.onChange(e)}
                    placeholder="Type your request for Alexa..."
                    className="request-input"
                />
            </form>
        );
    }
}

export default UserRequestToAlexaForm;