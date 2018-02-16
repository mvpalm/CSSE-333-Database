import React, { Component } from 'react';
import { connect } from 'react-redux';
import { viewReceipts, showItemDetail } from '../../actions/viewReceiptsActions';
import { Modal } from 'react-bootstrap';
import ReceiptInfo from './ReceiptInfo';
import { Select, Input } from 'semantic-ui-react';
import moment from 'moment';

class ViewRecieptsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            receiptData: [],
            selectedItem: null,
            searchQuery: "",
            sortBy: "issueDate",
            sortType: "DESC",
            icon: "fa fa-fw fa-sort-desc",
            searchBy: "customerName",
            searchPlaceholder: "Filter",
            currentPage: 1,
            entriesPerPage: 10,
            maxPages: 1,
            showModal: false
        };
        this.closeModal = this.closeModal.bind(this);
        this.onChange = this._onChange.bind(this);
        this.changeItemsPerPage = this.changeItemsPerPage.bind(this);
        this.changeSearchBy = this.changeSearchBy.bind(this);
    }

    closeModal() {
        this.setState({ showModal: false })
    }

    componentDidMount() {
        this.props.viewReceipts(this.props.companyID).then(() => {
            this.setState({ receiptData: this.props.receipts, isLoading: false }, () => {
                this.calcMaxPages();
                this.sort();
            });
        });//populate
        this.changePage(1);
    }

    calcMaxPages() {
        this.setState({ maxPages: Math.ceil(this.state.receiptData.length / this.state.entriesPerPage) });
    }

    sort() {
        this.setState({
            receiptData: this.state.receiptData.sort((a, b) => {
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
        if (data.value === "issueDate") {
            this.setState({ searchPlaceholder: "MM/DD/YYYY" });
        } else {
            this.setState({ searchPlaceholder: "Search" });
        }
        this.setState({ searchBy: data.value })
    }

    search() {
        const filter = this.state.searchQuery.toUpperCase();
        let list = []
        this.props.receipts.forEach((result) => {
            if (this.state.sortBy === "issueDate") {
                result["issueDate"] = moment(result).local().format("MM/DD/YYYY")
            }
            if (String(result[this.state.searchBy]).toUpperCase().startsWith(filter)) {
                list.push(result);
            }
        });
        this.setState({ receiptData: list }, () => { this.sort() });
    }

    _onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => { this.search() });
    }

    changeItemsPerPage(e) {
        this.setState({ entriesPerPage: Number(e.target.value) }, () => { this.calcMaxPages(); })
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

    render() {
        const { selectedItem } = this.state;
        const receiptData = (!this.state.receiptData || this.state.receiptData.length) === 0 ? <tr><td colSpan={4} style={{ textAlign: "center" }}>No Data Available</td></tr> :
            this.state.receiptData.slice((this.state.currentPage - 1) * this.state.entriesPerPage, (this.state.currentPage * this.state.entriesPerPage)).map((receipt, i) => {
                return (
                    <tr key={i} onClick={() => {
                        this.setState({ selectedItem: receipt, showModal: true });
                    }}>
                        <td>{moment(receipt.issueDate).local().format("llll")}</td>
                        <td>{receipt.uniqueID}</td>
                        <td>{receipt.totalCost}</td>
                        <td style={{ width: "300px" }}>{receipt.customerName}</td>
                    </tr>
                )
            })


        const searchOptions = [
            { key: 'customerName', text: 'Customer', value: 'customerName' },
            { key: 'issueDate', text: 'Date', value: 'issueDate' },
            { key: 'uniqueID', text: 'Receipt ID', value: 'uniqueID' },
        ]
        return (

            <div className="container" style={{ marginTop: "50px" }}>
                <center><h1>Receipt History</h1></center>
                <div style={{ marginTop: "25px" }}>
                    <div className="form-group pull-right" style={{ width: "400px" }}>
                        <Input type='text' placeholder={this.state.searchPlaceholder} name="searchQuery" onChange={this.onChange}>
                            <input />
                            <Select options={searchOptions} onChange={this.changeSearchBy} defaultValue='customerName' />
                        </Input>
                    </div>
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th onClick={() => this.changeSort("issueDate")} ><a href="#">Date Issued</a>{this.state.sortBy === "issueDate" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                                <th onClick={() => this.changeSort("uniqueID")} ><a href="#">Receipt ID</a>{this.state.sortBy === "uniqueID" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                                <th onClick={() => this.changeSort("totalCost")}><a href="#">Cost</a>{this.state.sortBy === "totalCost" ? <a><i className={this.state.icon}></i></a> : <a><i className="fa fa-fw fa-sort"></i></a>}</th>
                                <th>Customer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptData}
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
                    {selectedItem && <Modal show={this.state.showModal} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Receipt Detail #id {selectedItem.uniqueID}</Modal.Title>
                            <p>Customer: (#{selectedItem.customerID}) {selectedItem.customerName}</p>
                        </Modal.Header>
                        <Modal.Body>
                            <ReceiptInfo itemList={selectedItem} />
                        </Modal.Body>
                    </Modal>}
                </div>
            </div >
        );
    }
}
function mapStateToProps(state) {
    return {
        companyID: state.auth.company.id,
        receipts: state.viewReceipts.Receipts,
        showModal: state.viewReceipts.showModal
    }
}


export default connect(mapStateToProps, { viewReceipts, showItemDetail })(ViewRecieptsPage);