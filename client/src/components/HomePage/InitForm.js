import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import StatesAndCities from '../../data/StatesAndCities';
import TextFieldGroup from '../common/TextFieldGroup';
import axios from 'axios';

export default class InitForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            companyID: this.props.companyID,
            Address1: "",
            Address2: "",
            State: "",
            City: "",
            zipCode: "",
            disableCity: true,
            isLoading: false,
            errors: {}
        }
        this.onPickState = this.onPickState.bind(this);
        this.onPickCity = this.onPickCity.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onPickState(e, data) {
        this.setState({ State: data.value, disableCity: false })
    }

    onPickCity(e, data) {
        this.setState({ City: data.value })
    }

    _onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ errors: {}, isLoading: true }); //clear errors
        axios.post('/api/auth/Submit', this.state).then((res) => {
            this.props.closeCompanyInfo();
        }).catch((error) => {
            console.log("ERROR: ", error);
            console.log("error.message: ", error.message);
            console.log("error.code: ", error.code);
            console.log("error.config: ", error.config);
            console.log("error.response: ", error.response);
            console.log("error.response.data: ", error.response.data);
            this.setState({ errors: error.response.data, isLoading: false })

        });
        console.log(this.state);
    }

    render() {
        const stateOptions = Object.keys(StatesAndCities).map((state, i) => {
            return { key: i, value: state, text: state }
        })
        const cityOptions = this.state.disableCity ? [] : StatesAndCities[this.state.State].map((city, i) => {
            return { key: i, value: city, text: city }
        })
        const { errors } = this.state;
        console.log(errors);
        return (
            <form onSubmit={this.onSubmit} style={{ marginTop: '10px' }}>
                <h1>Company Location</h1>
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                < TextFieldGroup value={this.state.passwordConfirmation} onChange={this.onChange} label='Address Line 1' field='Address1' error={errors.address1} //name
                />
                <TextFieldGroup value={this.state.passwordConfirmation} onChange={this.onChange} label='Address Line 2' error={errors.address2} field='Address2' //name
                />
                <Dropdown placeholder='State' onChange={this.onPickState} search selection options={stateOptions} />
                <Dropdown placeholder='City' onChange={this.onPickCity} disabled={this.state.disableCity} search selection options={cityOptions} />
                <TextFieldGroup value={this.state.passwordConfirmation} onChange={this.onChange} label='Zip Code' error={errors.zipCode} maxLength="9" type="Number" field='zipCode' //name
                />
                <button disabled={this.state.isLoading} type="submit" className="btn btn-primary pull-right">Submit</button>
            </form>
        )

    }
}
