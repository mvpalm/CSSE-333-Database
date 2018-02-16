import React, { Component } from 'react';
import TextFieldGroup from '../common/TextFieldGroup';
import ReadOnlyFieldGroup from '../common/ReadOnlyFieldGroup';
import moment from "moment";

export default class DetailsDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            price: "",
            description: "",
            dateCreated: "",
            id: "",
            qty: "",
            disabled: true,
            initialLoad: true,
            errors: {}
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    componentDidMount() {
        this.setState({ initialLoad: false });
    }
    componentWillReceiveProps(newProps) {
        if (!this.state.initialLoad) {
            console.log("new props: ", newProps);
            if (newProps.items) {
                this.setState({
                    name: newProps.items.name,
                    price: newProps.items.price,
                    description: newProps.items.description,
                    dateCreated: moment(newProps.items.dateCreated).utc().local().format("llll"),
                    id: newProps.items.id,
                    qty: newProps.items.qty,
                    disabled: true
                })
            }

        }
    }
    _onChange(e) {
        this.setState({ [e.target.name]: e.target.value, disabled: false });
    }
    onSubmit(e) {
        e.preventDefault();
        this.setState({ errors: {} }); //clear errors
        if (this.state.id === null || this.state.id === "") {
            this.state.errors.form = "Can't update non registered item"
            this.setState({ errors: this.state.errors });
            return;
        }
        this.props.updateItem(this.state).then((res) => {
            console.log("Successfully updated item!");

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
        console.log(this.state);
        const { name, price, description, dateCreated, id, qty, disabled, errors } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <h1>Item Details</h1>

                <TextFieldGroup
                    label="Item Name"
                    maxLength="30"
                    field="name"
                    onChange={this.onChange}
                    value={name}
                />
                <TextFieldGroup
                    label="Price"
                    maxLength="30"
                    field="price"
                    onChange={this.onChange}
                    value={price}
                />
                <TextFieldGroup
                    label="Description"
                    field="description"
                    maxLength="45"
                    onChange={this.onChange}
                    value={description}
                />
                <div className="input-group">
                    <label className="control-label">Inventory Qty</label>
                    <input
                        value={qty}
                        readOnly={true}
                        className="form-control"
                    />
                    <span className="input-group-btn" >
                        <button className="btn btn-default" onClick={() => { this.props.showInventory() }} style={{ marginTop: '24px' }} type="button">Update Inventory</button>
                    </span>
                </div>
                <ReadOnlyFieldGroup
                    label="Date Created"
                    value={dateCreated}
                />
                <ReadOnlyFieldGroup
                    label="id"
                    value={id}
                />
                <div className="form-group">
                    <button disabled className="btn btn-danger btn-lg">Delete</button>
                    <button disabled={disabled} className="btn btn-primary btn-lg pull-right">Update</button>
                </div>
            </form >
        );
    }
}

