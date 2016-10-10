import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import {TextField, FlatButton} from 'material-ui';

import apiUser from '../../api/user';
import {SubmissionError} from 'redux-form'

const renderNameField = ({input, label, meta: {touched, error}, ...custom}) => (
    <TextField
        hintText={label}
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        {...custom}
    />
)

const renderPasswordField = ({input, label, meta: {touched, error}, ...custom}) => (
    <TextField
        hintText={label}
        type="password"
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        {...custom}
    />
)

const validate = values => {
    const errors = {}
    const requiredFields = ['name', 'password']

    requiredFields.forEach(field=> {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    return errors
}

class Form extends Component {
    authorization = values => (
        apiUser.authorize(values.name, values.password)
            .then(()=> {
                this.props.rerender();
            })
            .catch((err) => {
                if (err.message === 'Wrong password.') {
                    throw new SubmissionError({
                        password: 'Wrong password',
                        _error: 'Login failed!'
                    })
                } else console.error(err)
            })
    )

    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.authorization)}>
                <div>
                    <Field name="name" component={renderNameField} label="Name"/>
                </div>
                <div>
                    <Field name="password" component={renderPasswordField} label="Password"/>
                </div>
                <div>
                    <FlatButton
                        label="Sign up || Log in"
                        primary={true}
                        type="submit"
                        style={{width: 256}}/>
                </div>
            </form>
        )
    }
}

export default reduxForm({
    form: "Form",
    validate
})(Form)