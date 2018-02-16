import React, { Component } from 'react';
import {TableHeaderColumn, BootstrapTable} from 'react-bootstrap-table';
export default class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <form>
                <BootstrapTable
                    data={this.props.itemList.items}
                    search={true}
                    exportCSV
                    csvFileName='Current_Receipt'
                    bodyStyle={{ background: 'white' }}
                    height="450px" maxHeight='450px'
                >
                    <TableHeaderColumn dataField='itemID' isKey={true} sort={true}>Item ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='itemName' editable={false}>Item Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='itemPrice' dataFormat={this.priceFormatter} editable={false} >Price</TableHeaderColumn>
                    <TableHeaderColumn dataField='itemQty' >Qty</TableHeaderColumn>
                </BootstrapTable>
            </form>
        );
    }
}

