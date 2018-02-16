import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTransactions, getChartData } from '../../actions/inventoryActions';
import { populateList } from '../../actions/ItemActions';
import InventoryTable from './InventoryTable';
import Chart from './Chart';

const GRAPH_DATA = "Transaction Table";
const TRANSACTION_TABLE = "Graphical Data ";
class InventoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: TRANSACTION_TABLE
    }
  }
  componentDidMount() {
    if (this.props.items.length === 0) { // check if actually emptys) { // check is doesnt exists
      this.props.populateList(this.props.companyID);
    }
  }


  render() {
    const { getTransactions, getChartData, companyID, populateList, items } = this.props;
    return (
      <div className="container-fluid">
        <div className="pull-right" style={{ marginTop: "25px" }}>
          <button type="button" onClick={() => { this.setState({ mode: this.state.mode === TRANSACTION_TABLE ? GRAPH_DATA : TRANSACTION_TABLE }) }} className="btn btn-primary btn-lg">{this.state.mode}</button>
        </div>
        {this.state.mode === TRANSACTION_TABLE ? <InventoryTable getTransactions={getTransactions} companyID={companyID} /> : <Chart populateList={populateList} getChartData={getChartData} items={items} companyID={companyID} legendPosition="bottom" />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    companyID: state.auth.company.id,
    items: state.items.all
  }
}
export default connect(mapStateToProps, { getTransactions, getChartData, populateList })(InventoryPage)