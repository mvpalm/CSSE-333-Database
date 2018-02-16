import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class Receipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            customerID: this.props.customerID,
            errors: {}
        }
        this.onSubmit = this._onSubmit.bind(this);
    }

    _onSubmit(e) {
        e.preventDefault();
        this.setState({ errors: {} });
        let blob = {
            items: this.props.items,
            customerID: this.props.customerID
        }
        // if (confirm("Confirm Submission") !== true) {
        //     return;
        // } else {
        this.props.submitReceipt(blob).then((res) => {
            console.log("Successfully added item!", res);
            this.props.addFlashMessage({ type: 'success', text: 'Receipt Created!' });

        }).catch((error) => {
            console.log("error.message: ", error.message);
            console.log("error.code: ", error.code);
            console.log("error.config: ", error.config);
            console.log("error.response: ", error.response);
            console.log("error.response.data: ", error.response.data);
            this.setState({ errors: error.response.data })
        });

    }

    _afterSaveCell(row, cellName, cellValue) {
        this.props.editReceipt(row);
    }
    _handleDeletedRow(rows) {
        this.props.deleteReceiptItem(rows);
    }

    priceFormatter(cell, row) {
        return '<i class="glyphicon glyphicon-usd"></i> ' + cell;
    }



    render() {
        const selectRowProp = {
            mode: 'checkbox',
        };

        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: this._afterSaveCell.bind(this)
        };
        const options = {
            afterDeleteRow: this._handleDeletedRow.bind(this),
        };
        const { errors } = this.state;
        let displayError = ""
        if (errors.form) {
            displayError = errors.form.map((element, i) => {
                // console.log(element),
                return <li key={i}>{element}</li>
            })
        }

        return (
            <form onSubmit={this.onSubmit} style={{ backgroundColor: "white" }}>
                {errors.form && <div className="alert alert-danger">{displayError}</div>}
                <BootstrapTable
                    data={this.props.items}
                    options={options}
                    search={true}
                    selectRow={selectRowProp}
                    deleteRow
                    cellEdit={cellEditProp}
                    exportCSV
                    csvFileName='Current_Receipt'
                    bodyStyle={{ background: 'rgba(0,0,0,.4)' }}
                    height="450px" maxHeight='450px'
                >
                    <TableHeaderColumn dataField='itemID' isKey={true}>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='itemName' editable={false}>Item Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='price' dataFormat={this.priceFormatter} editable={false} >Price</TableHeaderColumn>
                    <TableHeaderColumn dataField='qty' >Qty</TableHeaderColumn>
                </BootstrapTable>
                <div className="form-group pull-right" style={{ marginTop: "5" }}>
                    <label className="control-label">Total Cost</label>
                    <input
                        value={this.props.items.reduce((acc, value) => {
                            return acc += value.price * value.qty
                        }, 0)}
                        type="text"
                        name="totalCost"
                        className="form-control"
                        style={{ marginBottom: "5" }}
                        readOnly
                    />
                    <button type="submit" style={{ width: "10vw" }} className="btn btn-primary">Create</button>
                </div>
            </form>
        );
    }
}