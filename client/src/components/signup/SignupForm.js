import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextFieldGroup from '../common/TextFieldGroup';
import { Redirect } from 'react-router-dom';
import axios from 'axios'
import { addFlashMessage } from '../../actions/flashMessages';
import validator from 'validator'
var isEmpty = require('lodash/isEmpty');


class SignupForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            companyName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errors: {},
            isLoading: false,
            redirect: false,
            invalid: false, // disable button
        }
        this.onChange = this._onChange.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
        this.onBlur = this._checkCompanyExists.bind(this);
    }
    validateInputs(data) {
        let errors = {}
        if (validator.isEmpty(data.companyName)) {
            errors.companyName = 'Company Name is is required';
        }
        if (validator.isEmpty(data.email)) {
            errors.email = 'Email is required';
        }
        if (!validator.isEmail(data.email)) {
            errors.email = "Not a valid email";
        }
        if (validator.isEmpty(data.password)) {
            errors.password = 'Password is required';
        }
        if (validator.isEmpty(data.passwordConfirmation)) {
            errors.passwordConfirmation = 'Password Confirmation is required';
        }
        if (!validator.equals(data.password, data.passwordConfirmation)) {
            errors.passwordConfirmation = "Passwords must match";
        }

        return {
            errors,
            isValid: isEmpty(errors)
        }
    }
    isValid() {
        const { errors, isValid } = this.validateInputs(this.state);

        if (!isValid) {
            this.setState({ errors });
        }

        return isValid;
    }

    _checkCompanyExists(e) {
        const field = e.target.name;//name of field
        const value = e.target.value;
        if (value !== '') {
            axios.get(`/api/companies/${value}`, this.state).then((res) => {
                let errors = this.state.errors;
                let invalid;
                if (res.data.company) {
                    errors[field] = `${field === 'companyName' ? 'Company Name' : 'Email'} already exists`;
                    invalid = true;
                } else {
                    errors[field] = '';
                    invalid = false;
                }
                this.setState({ errors, invalid });
            });
        }
    }
    _onSubmit(e) {
        e.preventDefault();
        if (this.isValid.bind(this)) {
            this.setState({ error: {}, isLoading: true }); //clear errors
            axios.post('api/companies', this.state).then((res) => {
                console.log("Success!", res);
                this.props.addFlashMessage({ type: 'success', text: 'You have signed up successfully. Welcome!' })

                this.setState({ redirect: true })
            })
                .catch((error) => {
                    console.log("error.message: ", error.message);
                    console.log("error.code: ", error.code);
                    console.log("error.config: ", error.config);
                    console.log("error.response: ", error.response);
                    console.log("error.response.data: ", error.response.data);
                    this.setState({ errors: error.response.data, isLoading: false })
                });
            console.log(this.state);
        }
    }

    _onChange(e) {
        console.log(e.target.name);
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const { errors } = this.state;
        const { redirect } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Join our community!</h1>
                <TextFieldGroup value={this.state.companyName} onChange={this.onChange} label='Company Name' field='companyName' //name
                    error={errors.companyName} checkCompanyExists={this.onBlur} />
                <TextFieldGroup value={this.state.email} onChange={this.onChange} label='Email' field='email' //name
                    error={errors.email} checkCompanyExists={this.onBlur} />
                <TextFieldGroup value={this.state.password} onChange={this.onChange} label='Password' field='password' //name
                    type="password" error={errors.password} />
                <TextFieldGroup value={this.state.passwordConfirmation} onChange={this.onChange} label='Password Confirmation' field='passwordConfirmation' //name
                    type="password" error={errors.passwordConfirmation} />
                <div className="form-group">
                    <button disabled={this.state.isLoading || this.state.invalid} className="btn btn-primary btn-lg">Sign up</button>
                </div>
                {redirect && <Redirect push to='/' />}
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        addFlashMessage: (message) => dispatch(addFlashMessage(message)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);