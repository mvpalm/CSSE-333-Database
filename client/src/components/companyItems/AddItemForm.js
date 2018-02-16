import React, { Component } from 'react';
import TextFieldGroup from '../common/TextFieldGroup';
import classnames from 'classnames';


export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      price: null,
      qty: null,
      companyName: props.companyName,
      companyID: props.companyID,
      errors: {}
    };
    this.onChange = this._onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  _onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {} }); //clear errors
    console.log(this.state);
    this.props.addItem(this.state).then((res) => {
      console.log("Successfully added item!");

    }).catch((error) => {
      console.log("error.message: ", error.message);
      console.log("error.code: ", error.code);
      console.log("error.config: ", error.config);
      console.log("error.response: ", error.response);
      console.log("error.response.data: ", error.response.data);
      this.setState({ errors: error.response.data })
    });
  }

  render() {
    const { errors, redirect } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Create New Item</h1>

        <TextFieldGroup
          label="Item Name"
          field="name"
          value={this.state.name}
          onChange={this.onChange}
          error={errors.itemName}
        />
        <div className={classnames("input-group", { 'has-error': errors.price })} style={{ marginBottom: '20px' }}>
          <label className="control-label"><i className="glyphicon glyphicon-usd"></i> Price</label>
          <input
            value={this.state.price}
            onChange={this.onChange}
            type='number'
            name='price'
            className="form-control"
            autoComplete="off"
          />
          {errors && <span className="help-block">{errors.price}</span>}
        </div>
        <div className={classnames("input-group", { 'has-error': errors.qty })} style={{ marginBottom: '20px' }}>
          <label className="control-label">Initial Qty</label>
          <input
            value={this.state.qty}
            onChange={this.onChange}
            type='number'
            name='qty'
            className="form-control"
            autoComplete="off"
          />
          {errors && <span className="help-block">{errors.qty}</span>}
        </div>
        <TextFieldGroup
          label="Description (Optional)"
          field="description"
          value={this.state.description}
          onChange={this.onChange}
          error={errors.description}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-primary">Create</button>
        </div>
      </form>
    );
  }
}

