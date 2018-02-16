import React, { Component } from 'react';
import TextFieldGroup from '../common/TextFieldGroup';


export default class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerFirstName: "",
            customerLastName: "",
            customerEmail: "",
            companyID: this.props.companyID,
            errors: {},
        };
        this.onChange = this._onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    _onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ errors: {} }); //clear errors
        console.log(this.state);
        this.props.createCustomer(this.state).then((res) => {
            this.props.closeModal();
        }).catch((error) => {
            console.log("error.message: ", error.message);
            console.log("error.code: ", error.code);
            console.log("error.config: ", error.config);
            console.log("error.response: ", error.response);
            console.log("error.response.data: ", error.response.data);
            this.setState({ errors: error.response.data })
        });
    }

    render() {
        const { errors } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <h1>New Customer</h1>
                <TextFieldGroup maxLength={45} field="customerFirstName" label="First Name" onChange={this.onChange} value={this.state.customerFirstName} />
                <TextFieldGroup maxLength={45} field="customerLastName" label="Last Name" onChange={this.onChange} value={this.state.customerLastName} />
                <TextFieldGroup maxLength={45} field="customerEmail" type="email" label="Email" onChange={this.onChange} value={this.state.customerEmail} error={errors.email} />
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        );
    }
}

