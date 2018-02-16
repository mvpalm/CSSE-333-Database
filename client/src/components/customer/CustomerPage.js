import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Input } from 'semantic-ui-react';
import moment from 'moment';
import { getCustomerList, deleteCustomer } from '../../actions/customerActions';

class CustomerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            CustomerData: [],
            searchQuery: "",
            sortBy: "DateJoined",
            sortType: "DESC",
            icon: "fa fa-fw fa-sort-desc",
            searchBy: "customerName",
            searchPlaceholder: "Filter",
            currentPage: 1,
            entriesPerPage: 10,
            maxPages: 1,
        };
        this.onChange = this._onChange.bind(this);
        this.changeItemsPerPage = this.changeItemsPerPage.bind(this);
        this.changeSearchBy = this.changeSearchBy.bind(this);
    }

    componentDidMount() {
        this.props.getCustomerList(this.props.companyID).then(() => {
            console.log(this.props.customers);
            this.setState({ CustomerData: this.props.customers.slice(1), isLoading: false }, () => {
                this.calcMaxPages();
                this.sort();
            })
        });//populate
        this.changePage(1);
        console.log("data: ", this.state.CustomerData);
    }

    calcMaxPages() {
        this.setState({ maxPages: Math.ceil(this.state.CustomerData.length / this.state.entriesPerPage) });
    }

    sort() {
        this.setState({
            CustomerData: this.state.CustomerData.sort((a, b) => {
                const aKey = a[this.state.sortBy];
                const bKey = b[this.state.sortBy];
                if (this.state.sortType === "ASC") {
                    return aKey - bKey;
                }
                return bKey - aKey

            })
        });
    }

    changeSort(sortBy) {
        this.state.sortType === "DESC" ? this.setState({ sortBy, sortType: "ASC", icon: "fa fa-fw fa-sort-asc" }, () => { this.sort() }) : this.setState({ sortBy, sortType: "DESC", icon: "fa fa-fw fa-sort-desc" }, () => { this.sort() });
    }

    changeSearchBy(e, data) {
        console.log("searchBy: ", data.value);
        if (data.value === "DateJoined") {
            this.setState({ searchPlaceholder: "MM/DD/YYYY" });
        } else {
            this.setState({ searchPlaceholder: "Filter" });
        }
        this.setState({ searchBy: data.value })
    }

    search() {
        const filter = this.state.searchQuery.toUpperCase();
        let list = []
        this.props.customers.slice(1).forEach((result) => {
            if (this.state.sortBy === "DateJoined") {
                result["DateJoined"] = moment(result).local().format("MM/DD/YYYY")
            }
            if (String(result[this.state.searchBy]).toUpperCase().startsWith(filter)) {
                list.push(result);
            }
        });
        this.setState({ CustomerData: list }, () => { this.sort() });
    }

    _onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => { this.search() });
    }

    changeItemsPerPage(e) {
        this.setState({ itemsPerPage: Number(e.target.value) });
        this.calcMaxPages();
    }

    changePage(page) {
        if (page < 1) {
            page = 1;
        }

        if (page > this.state.maxPages) {
            page = this.state.maxPages;
        }
        this.setState({ currentPage: page });
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.isLoading) { //initial load false
            this.setState({
                CustomerData: nextProps.customers.slice(1)
            })
        }
    }
    render() {

        const CustomerData = (!this.state.CustomerData || this.state.CustomerData.length) === 0 ? <tr><td colSpan={8} style={{ textAlign: "center" }}>No Data Available</td></tr> :
            this.state.CustomerData.slice((this.state.currentPage - 1) * this.state.entriesPerPage, (this.state.currentPage * this.state.entriesPerPage)).map((customers, i) => {
                return (
                    <tr key={i}>
                        <td>{moment(customers.issueDate).local().format("llll")}</td>
                        <td>{customers.id}</td>
                        <td>{customers.timesVisited}</td>
                        <td>{customers.itemsBought}</td>
                        <td>{customers.fName}</td>
                        <td>{customers.lName}</td>
                        <td>{customers.email}</td>
                        <td onClick={() => this.props.deleteCustomer(customers.id)} style={{ width: "25", textAlign: "center" }}><i className="fa fa-trash fa-2x"></i></td>
                    </tr>
                )
            })

        const searchOptions = [
            { key: 'email', text: 'Customer Email', value: 'email' },
            { key: 'DateJoined', text: 'Joined Date', value: 'DateJoined' },
            { key: 'uniqueID', text: 'ID', value: 'uniqueID' },
        ]
        return (

            <div className="container" style={{ marginTop: "50px" }}>
                <center><h1>Customers</h1></center>
                <div style={{ marginTop: "25px" }}>
                    <div className="form-group pull-right" style={{ width: "400px" }}>
                        <Input type='text' placeholder={this.state.searchPlaceholder} name="searchQuery" onChange={this.onChange}>
                            <input />
                            <Select options={searchOptions} onChange={this.changeSearchBy} defaultValue='email' />
                        </Input>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }} onClick={() => this.changeSort("DateJoined")} ><a href="#">Date Joined</a>{this.state.sortBy === "DateJoined" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                                <th style={{ width: '150px' }} onClick={() => this.changeSort("id")} ><a href="#">Customer ID</a>{this.state.sortBy === "id" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                                <th onClick={() => this.changeSort("timesVisited")} ><a href="#">Times Visited</a>{this.state.sortBy === "timesVisited" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                                <th onClick={() => this.changeSort("itemsBought")} ><a href="#">Items Bought</a>{this.state.sortBy === "itemsBought" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CustomerData}
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
                    </div>
                    <div className="btn-toolbar pull-right" role="toolbar">
                        <div className="btn-group" >
                            <button type="button" onClick={() => this.changePage(1)} className="btn btn-default color-blue"><i className="fa fa-fast-backward"></i></button>
                            <button type="button" onClick={() => this.changePage(this.state.currentPage - 1)} className="btn btn-default color-blue"><i className="fa fa-step-backward"></i></button>
                            <button type="button" className="btn btn-default text-faded">{this.state.currentPage} of {this.state.maxPages}</button>
                            <button type="button" onClick={() => this.changePage(this.state.currentPage + 1)} className="btn btn-default color-blue"><i className="fa fa-step-forward"></i></button>
                            <button type="button" onClick={() => this.changePage(this.state.maxPages)} className="btn btn-default color-blue"><i className="fa fa-fast-forward"></i></button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
function mapStateToProps(state) {
    return {
        companyID: state.auth.company.id,
        customers: state.customer
    }
}


export default connect(mapStateToProps, { getCustomerList, deleteCustomer })(CustomerPage);