import React, { Component } from 'react';
import TextFieldGroup from '../common/TextFieldGroup';
import ReadOnlyFieldGroup from '../common/ReadOnlyFieldGroup';


export default class UpdateInventory extends Component {
    constructor(props) {
        super(props);
        console.log("PROPSL ", props);
        this.state = {
            name: this.props.itemName,
            oldQty: this.props.qty,
            newQty: this.props.qty,
            itemID: this.props.itemID,
            companyID: props.companyID,
            reason: "",
            errors: {},
            index: this.props.selectedIndex
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
        if (this.state.oldQty - this.state.newQty === 0) {
            this.state.errors.qty = "Needs to be a new value"
            this.setState({ errors: this.state.errors });
            return;
        }
        this.props.updateInventory(this.state).then((res) => {
            this.props.closeModal();
            console.log("Successfully updated Inventor item!");

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
        let newLabel = () => {
            let diff = this.state.oldQty - this.state.newQty;
            return diff > 0 ? "Updated Qty -" + Math.abs(diff) : "Updated Qty +" + Math.abs(diff);
        }
        return (
            <form onSubmit={this.onSubmit}>
                <ReadOnlyFieldGroup
                    label="Item Name"
                    field="name"
                    value={this.state.name}
                />
                <ReadOnlyFieldGroup
                    label="Original Qty"
                    field="Qty"
                    value={this.state.oldQty}
                />
                <TextFieldGroup
                    label={newLabel()}
                    field="newQty"
                    type="Number"
                    value={this.state.newQty}
                    onChange={this.onChange}
                    error={errors.qty}
                    maxLength="9"
                />
                <TextFieldGroup
                    label="Reason (Optional)"
                    field="reason"
                    value={this.state.description}
                    onChange={this.onChange}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Update</button>
                </div>
            </form>
        );
    }
}

