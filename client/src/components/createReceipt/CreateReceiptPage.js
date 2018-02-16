import React, { Component } from 'react';
import SideList from './SideList';
import { connect } from 'react-redux';
import { populateList } from '../../actions/ItemActions';
import { addFlashMessage } from '../../actions/flashMessages';
import { addToReceipt, updateReceipt, deleteReceiptItem, submitReceipt, getReceiptID } from '../../actions/CurrentReceiptActions';
import { createCustomer, getCustomerList } from '../../actions/customerActions';
import ReadOnlyFieldGroup from '../common/ReadOnlyFieldGroup';
import NewCustomerForm from './NewCustomerForm';
import { Dropdown, Divider } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
import Receipt from './Receipt';

class CreateReceiptPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            customerID: -1,
            firstName: "",
            lastName: "",
            email: ""
        }
        if (this.props.items.length === 0) { // check if actually emptys)
            this.props.populateList(this.props.companyID);
        }
        if (this.props.customers.length === 0) {
            this.props.getCustomerList(this.props.companyID);
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    _onChange(e, data) {
        this.setState({
            firstName: this.props.customers[data.value].fName,
            lastName: this.props.customers[data.value].lName,
            email: this.props.customers[data.value].email,
            customerID: this.props.customers[data.value].id
        });
    }


    render() {
        const { addItem, companyID, submitReceipt, addFlashMessage, createCustomer, customers } = this.props;
        const customerOptions = customers.map((customer, i) => {
            return { key: customer.email, value: i, text: customer.email }
        })

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4" style={{ width: "300px", maxHeight: "200px" }}>
                        <h1>Your Items</h1>
                        {<SideList list={this.props.items} addItem={this.props.addToReceipt} />}
                    </div>
                    <div className="col-lg-4 col-md-offset-1">
                        <h1>Create Receipt🔥</h1>
                        {<Receipt items={this.props.receiptItems} customerID={this.state.customerID} editReceipt={this.props.updateReceipt} deleteReceiptItem={this.props.deleteReceiptItem} submitReceipt={submitReceipt} addFlashMessage={addFlashMessage} />}
                    </div>
                    <div className="col-lg-2 col-md-offset-1">
                        <h1>Customer Info</h1>
                        <button className="btn btn-primary btn-md" style={{ width: "100%", textAlign: "center" }} onClick={this.open}>Create New Customer</button>
                        <Divider fitted horizontal>Or</Divider>
                        <p style={{ width: "100%", textAlign: "center" }}>Select Existing Customer</p>
                        <Dropdown placeholder="Select Customer"
                            search
                            selection
                            onChange={this.onChange}
                            options={customerOptions} />
                        <Divider horizontal></Divider>
                        <ReadOnlyFieldGroup field="firstName" value={this.state.firstName} label="First Name" />
                        <ReadOnlyFieldGroup field="lastName" value={this.state.lastName} label="Last Name" />
                        <ReadOnlyFieldGroup field="Email" value={this.state.email} label="Email" />
                    </div>
                </div>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <NewCustomerForm createCustomer={createCustomer} closeModal={this.close} companyID={companyID} />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        companyID: state.auth.company.id,
        items: state.items.all,
        receiptItems: state.currentReceipt.receiptItems,
        customers: state.customer
    }
}


export default connect(mapStateToProps, { addToReceipt, populateList, updateReceipt, deleteReceiptItem, submitReceipt, addFlashMessage, createCustomer, getCustomerList })(CreateReceiptPage);