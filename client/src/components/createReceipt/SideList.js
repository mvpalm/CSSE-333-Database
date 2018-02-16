import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class SideList extends Component {
  constructor (props) {
    super(props);
    this.onRowClick = this._onRowClick.bind(this);
  }
  _onRowClick (row) {
    this.props.addItem({ itemID: row.id, itemName: row.name, price: row.price, inStock: row.qty });
  }

  render () {
    const options = {
      onRowClick: this.onRowClick
    };
    return (
      <div style={{ backgroundColor: '#FDF3E7' }} >
        <BootstrapTable data={this.props.list} options={options} hover condensed height='500px' maxHeight='500px'
          bodyStyle={{ background: 'rgba(0,0,0,.2)' }} >
          <TableHeaderColumn dataField='name' isKey dataAlign={'center'} tdStyle={{ height: '30px', fontSize: '35px' }}>Add Items to Receipt</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
