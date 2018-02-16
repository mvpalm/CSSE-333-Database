import React, { Component } from 'react';
import SideBar from './SideBar';
import AddItemForm from './AddItemForm';
import DetailsDisplay from './DetailsDisplay';
import { connect } from 'react-redux';
import { populateList, addItem, updateItem, showAddItemForm, updateInventory } from '../../actions/ItemActions';
import { Modal } from 'react-bootstrap';
import UpdateInventory from './UpdateInventory';

class AddItemsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialLoad: true,
      selectedItem: 0,
      showInventory: false
    }
    this.changeSelectedItem = this.changeSelectedItem.bind(this);
    this.showUpdateInventory = this.showUpdateInventory.bind(this);
    this.closeUpdateInventory = this.closeUpdateInventory.bind(this);
  }

  componentDidMount() {
    if (this.props.items.length === 0) { // check if actually emptys) { // check is doesnt exists
      console.log(this.props.items.all);
      console.log("POPULATE LIST");
      this.props.populateList(this.props.companyID);
    }
    this.setState({
      initialLoad: false,
      selectedItem: this.props.showItemDetailid ? this.props.showItemDetailid : 0,
    });
  }

  showUpdateInventory() {
    this.setState({
      showInventory: true
    })
  }
  closeUpdateInventory() {
    this.setState({
      showInventory: false
    })
  }

  changeSelectedItem(i) {
    this.setState({ selectedItem: i })
  }

  render() {
    const { addItem, companyID, updateItem, companyName, showAddItemForm } = this.props;
    const { selectedItem, showInventory } = this.state;
    console.log("Selected Item: ", selectedItem);
    let showModal = this.props.showModal;
    if (!showModal) {
      showModal = false;
    }
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4" style={{ width: "250px", maxHeight: "200px" }}>
            <h1>Your Items🔥🔥🔥</h1>
            <SideBar list={this.props.items} showItemDetail={this.changeSelectedItem} showAddItemForm={showAddItemForm} />
          </div>
          <div className="col-md-4 col-md-offset-2">
            <DetailsDisplay items={this.props.items[selectedItem]} updateItem={updateItem} showInventory={this.showUpdateInventory} />
          </div>
        </div>
        <Modal show={showModal} onHide={() => showAddItemForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddItemForm
              addItem={addItem}
              companyID={companyID}
              companyName={companyName}
            />
          </Modal.Body>
        </Modal>
        <Modal show={showInventory} onHide={this.closeUpdateInventory}>
          <Modal.Header closeButton>
            <Modal.Title>Update Inventory</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.items[selectedItem] && <UpdateInventory
              updateInventory={this.props.updateInventory}
              closeModal={this.closeUpdateInventory}
              companyID={companyID}
              itemName={this.props.items[selectedItem].name}
              itemID={this.props.items[selectedItem].id}
              qty={this.props.items[selectedItem].qty}
              selectedIndex={selectedItem}
            />}
          </Modal.Body>
        </Modal>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return {
    companyID: state.auth.company.id,
    companyName: state.auth.company.companyName,
    items: state.items.all,
    showItemDetailid: state.items.id,
    showModal: state.items.showModal,
    showInventory: state.items.showInventoryModal
  }
}


export default connect(mapStateToProps, { populateList, addItem, updateItem, showAddItemForm, updateInventory })(AddItemsPage);