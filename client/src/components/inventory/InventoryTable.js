import React, { Component } from 'react';
import moment from 'moment';

export default class InventoryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionData: [],
            companyID: this.props.companyID,
            itemsPerPage: 10,
            searchQuery: "",
            searchPlaceholder: "Search",
            searchBy: "itemID",
            sortBy: "transactionDate",
            sortType: "DESC",
            icon: "fa fa-fw fa-sort-desc",
            currentPage: 1,
            Pages: 0
        }
        this.onChange = this._onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.changeItemsPerPage = this.changeItemsPerPage.bind(this);
    }
    componentDidMount() {
        this.getTransactionList();
    }
    getTransactionList() {
        this.props.getTransactions(this.state).then((res) => {
            this.setState({ transactionData: res.data.transactionList, Pages: res.data.Pages });
        });
    }
    changeSort(sortBy) {
        this.changePage(1);
        this.state.sortType === "DESC" ? this.setState({ sortBy, sortType: "ASC", icon: "fa fa-fw fa-sort-asc" }, () => { this.getTransactionList() }) : this.setState({ sortBy, sortType: "DESC", icon: "fa fa-fw fa-sort-desc" }, () => { this.getTransactionList() });
    }

    _onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => { this.getTransactionList() });
    }

    onSelect(e) {
        if (e.target.value === "transactionDate") {
            this.setState({ searchPlaceholder: "YYYY-MM-DD" });
        } else {
            this.setState({ searchPlaceholder: "Search" });
        }
        this.setState({ searchBy: e.target.value });
    }

    changeItemsPerPage(e) {
        this.setState({ itemsPerPage: Number(e.target.value) }, () => { this.getTransactionList() })
    }
    /**
     * Pagination funcions
     * @param {*} page 
     */
    changePage(page) {
        if (page < 1) {
            page = 1;
        }
        if (page > this.state.Pages) {
            page = this.state.Pages
        }
        this.setState({ currentPage: page }, () => { this.getTransactionList() });

    }

    render() {

        const transactionData = (!this.state.transactionData || this.state.transactionData.length === 0) ? <tr><td colSpan={6} style={{ textAlign: "center" }}>No Data Available</td></tr> : this.state.transactionData.map((element, i) => {
            let parsedDate = moment(element.transactionDate).utc().local().format("MM/DD/YYYY h:mm:ss")
            return (
                <tr key={i}>
                    <td>{element.itemID}</td>
                    <td>{element.itemName}</td>
                    <td>{parsedDate}</td>
                    <td>{element.transactionType}</td>
                    <td>{element.qty}</td>
                    <td style={{ maxWidth: "50px" }}>{element.Reason}</td>
                </tr>
            )
        })
        return (
            <div className="container" style={{ marginTop: "50px" }}>
                <center><h1>Transaction Data</h1></center>
                <div style={{marginTop:"25px"}}>
                    <div className="form-group pull-right">
                        <select onChange={this.onSelect} style={{ height: "40px" }}>
                            <option value="itemID" >Item ID</option>
                            <option value="name">Item Name</option>
                            <option value="transactionDate">Date</option>
                            <option value="qty">Transaction Amount</option>
                        </select>
                    </div>
                    <div className="form-group pull-right" style={{ width: "400px" }}>
                        <input onChange={this.onChange} name="searchQuery" type="text" className="form-control" placeholder={this.state.searchPlaceholder} style={{ height: "40px" }} />
                    </div>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th onClick={() => this.changeSort("itemID")} >Item ID{this.state.sortBy === "itemID" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                            <th onClick={() => this.changeSort("itemName")} >Item Name{this.state.sortBy === "itemName" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                            <th onClick={() => this.changeSort("transactionDate")}>Transaction Date{this.state.sortBy === "transactionDate" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                            <th onClick={() => this.changeSort("transactionType")}>Transaction Type{this.state.sortBy === "transactionType" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                            <th onClick={() => this.changeSort("qty")}>Transaction Amount{this.state.sortBy === "qty" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                            <th onClick={() => this.changeSort("reason")}>Reason{this.state.sortBy === "reason" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionData}
                    </tbody>
                </table>
                <div className="row">
                    <div className="pull-left">
                        <text style={{ height: "40px" }}> Display <select onChange={this.changeItemsPerPage} style={{ height: "20px", width: "70px" }}>
                            <option value="10" >10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select> Per Page</text>
                    </div>
                    <div className="btn-toolbar pull-right" role="toolbar">
                        <div className="btn-group" >
                            <button type="button" onClick={() => this.changePage(1)} className="btn btn-default color-blue"><i className="fa fa-fast-backward"></i></button>
                            <button type="button" onClick={() => this.changePage(this.state.currentPage - 1)} className="btn btn-default color-blue"><i className="fa fa-step-backward"></i></button>
                            <button type="button" className="btn btn-default text-faded">{this.state.currentPage} of {this.state.Pages}</button>
                            <button type="button" onClick={() => this.changePage(this.state.currentPage + 1)} className="btn btn-default color-blue"><i className="fa fa-step-forward"></i></button>
                            <button type="button" onClick={() => this.changePage(this.state.Pages)} className="btn btn-default color-blue"><i className="fa fa-fast-forward"></i></button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}