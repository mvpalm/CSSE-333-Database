import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextFieldGroup from '../common/TextFieldGroup';
import { Redirect } from 'react-router-dom';
import { login } from '../../actions/authActions';
import { addFlashMessage } from '../../actions/flashMessages';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: {},
            isLoading: false,
            redirect: false,
        }
        this.onChange = this._onChange.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
    }

    validateInput(data) {
        let errors = {};

        if (validator.isEmpty(data.email)) {
            errors.identifier = 'This field is required';
        }

        if (!validator.isEmail(data.email)) {
            errors.email = "Not a valid email";
        }

        if (validator.isEmpty(data.password)) {
            errors.password = 'This field is required';
        }

        return {
            errors,
            isValid: isEmpty(errors)
        };
    }

    isValid() {
        const { errors, isValid } = this.validateInputs(this.state);
        if (!isValid) {
            this.setState({ errors });
        }
        return isValid;
    }

    _onSubmit(e) {
        e.preventDefault();
        if (this.isValid.bind(this)) {
            this.setState({ error: {}, isLoading: true }); //clear errors
            this.props.login(this.state).then((res) => {
                console.log("true");
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
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const { errors } = this.state;
        const { redirect } = this.state;
        console.log(errors.form);
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Login</h1>
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <TextFieldGroup value={this.state.email} onChange={this.onChange} label='Email' field='email' //name
                    error={errors.email} checkCompanyExists={this.onBlur} />
                <TextFieldGroup value={this.state.password} onChange={this.onChange} label='Password' field='password' //name
                    type="password" error={errors.password} />
                <div className="form-group">
                    <button disabled={this.state.isLoading} className="btn btn-primary btn-lg">Login</button>
                </div>
                {redirect && <Redirect push to='/Home' />}
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (data) => dispatch(login(data)),
        addFlashMessage: (message) => dispatch(addFlashMessage(message)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);