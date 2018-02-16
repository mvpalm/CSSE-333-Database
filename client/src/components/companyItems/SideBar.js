import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class SideBar extends Component {
    constructor(props) {
        super(props);
        this.showAddItemForm = this._showAddItemForm.bind(this);
    }


    _showAddItemForm() {
        this.props.showAddItemForm(true);
    }

    render() {
        const displayList = this.props.list.map((data, i) => {
            return (
                < td key={data.id} className="list-group-item" > <Button style={{ width: "100%" }} onClick={() => this.props.showItemDetail(i)}>{data.name}</Button></td >
            )
        })
        
        console.log(displayList)

        return (
            <div>
                <div >
                    <div className="modal-container" style={{ height: 200 }}>
                        <table className="table table-hover table-striped header-fixed" data-spy="affix" data-offset-top="205" style={{ overflowY: 'scroll', height: "75vh", width: "250px", padding: "0 15px", border: '1px solid grey' }}>
                            <thead>
                                <tr>
                                    <th> <Button style={{ width: "100%" }} bsStyle="primary" bsSize="large" onClick={() => this.props.showAddItemForm(true)}>Add Item</Button></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {displayList}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}