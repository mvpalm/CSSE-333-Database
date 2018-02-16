import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Icon, Statistic, Divider, Feed } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
import { getMostPopularItems, viewReceipts } from '../../actions/viewReceiptsActions';
import { populateList } from '../../actions/ItemActions';
import { getCustomerList } from '../../actions/customerActions';
import { verifyInit } from '../../actions/authActions';
import moment from 'moment';
import InitForm from './InitForm';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentage: 0,
      feedData: [],
      mostSoldItems: [],
      FrequestCustomers: [],
      itemsSold: 0,
      totalSales: 0,
      totalProfit: 0,
      initModal: false
    };
    this.closeCompanyInfo = this
      .closeCompanyInfo
      .bind(this);
  }

  componentDidMount() {
    this.props.verifyInit(this.props.companyID).then((res) => {
      console.log(res);
      if (res.data.result.init === 0) {
        this.setState({ initModal: true });
      } else {
        this.setState({ initModal: false });
      }
    });


    this.props.getCustomerList(this.props.companyID).then(() => {
      this.mostFrequentCustomer();
    });



    if (this.props.items.length === 0) {
      this
        .props
        .populateList(this.props.companyID)
        .then(() => {
          this
            .props
            .getMostPopularItems(this.props.items)
            .then(() => {
              this.mostSoldItems();
            });
        });
    } else {
      this
        .props
        .getMostPopularItems(this.props.items)
        .then(() => {
          this.mostSoldItems();
        });
    }
    this
      .props
      .viewReceipts(this.props.companyID)
      .then(() => {
        this.mostRecentReceipts();
      });
  }
  componentWillUnmount() {
    clearInterval(this.thingy);
  }

  mostRecentReceipts() {
    this.setState({
      feedData: this
        .props
        .receipts
        .slice(0)
        .reverse()
        .slice(0, 10)
        .map((element, i) => {
          return (
            <Feed key={i} as={Link} to='/viewRecieptsPage'>
              <Feed.Event
                icon='file text'
                date={moment(element.issueDate)
                  .local()
                  .fromNow()}
                summary={'Receipt ' + element.uniqueID + ' Cost: ' + element.totalCost} />
              <Divider fitted />
            </Feed>
          );
        }),
      totalSales: this.props.receipts.length
    });
  }

  mostSoldItems() {
    this.setState({
      mostSoldItems: this
        .props
        .mostSoldItems
        .slice(0, 10)
        .map((element, i) => {
          return (
            <Feed key={i}>
              <Feed.Event
                icon='shopping bag'
                summary={`${i + 1}: ${element.itemName} | ${element.qty} sold`} />
              <Divider fitted />
            </Feed>
          );
        }),
      itemsSold: this
        .props
        .mostSoldItems
        .reduce((acc, value, index) => { // most sold items is an array with all items sorted
          acc += value.qty;
          return acc;
        }, 0),
      totalProfit: this
        .props
        .mostSoldItems
        .reduce((acc, value) => {
          acc += value.profit;
          return acc;
        }, 0)
    });
  }

  mostFrequentCustomer() {
    this.setState({
      mostFrequentCustomer: this
        .props
        .customers
        .slice(1, 11)
        .sort((a, b) => {
          const aKey = a.timesVisited;
          const bKey = b.timesVisited;
          return bKey - aKey;
        })
        .map((element, i) => {
          return (
            <Feed key={i} as={Link} to='/customer'>
              <Feed.Event
                icon='star'
                summary={`${i + 1}: ${element.fName} ${element.lName} id:${element.id} | Visted ${element.timesVisited} times`} />
              <Divider fitted />
            </Feed>
          );
        })
    });
  }

  numberWithCommas(x) {
    return x
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  closeCompanyInfo() {
    this.setState({ initModal: false });
  }
  render() {
    return (
      <div className='jumbotron'>
        <div style={{ marginTop: '-50px' }}>
          <h1>{this.props.companyName}'s Dashboard</h1>
          <Statistic style={{
            marginTop: '-50px'
          }} floated='right'>
            <Statistic.Value>{this.state.totalSales}</Statistic.Value>
            <Statistic.Label>Total Sales</Statistic.Label>
          </Statistic>
          <Statistic style={{
            marginTop: '-50px'
          }} floated='right'>
            <Statistic.Value>{this.numberWithCommas(this.state.itemsSold)}</Statistic.Value>
            <Statistic.Label>Items Sold</Statistic.Label>
          </Statistic>
        </div> <p> Overview and General Info </p>
        <Divider horizontal fitted>Dashboard</Divider > <div className='row' style={{ marginTop: '10px' }}>
          <div className='col-lg-3'>
            <Card
              as={Link}
              to='/addItem'
              style={{
                backgroundColor: 'rgba(253, 245, 230, .5)',
                height: '150px'
              }}>
              <Card.Content>
                <center><Icon name='write' size='huge' /></center>
                <Card.Header>
                  <center>
                    <h2 style={{
                      marginTop: '25px'
                    }}>Add/Delete Items<Icon name='add square' /></h2>
                  </center>
                </Card.Header>
              </Card.Content>
            </Card>
          </div>
          <div className='col-lg-3'>
            <Card
              as={Link}
              to='/createReceipt'
              style={{ backgroundColor: 'rgba(253, 245, 230, .5)', height: '150px' }} >
              <Card.Content>
                <center><Icon name='file text outline' size='huge' /></center>
                <Card.Header>
                  <center>
                    <h2 style={{
                      marginTop: '25px'
                    }}>Create Receipt<Icon name='add square' /></h2>
                  </center>
                </Card.Header>
              </Card.Content>
            </Card>
          </div>
          <div className='col-lg-3'>
            <Card
              as={Link}
              to='/customer'
              style={{ backgroundColor: 'rgba(253, 245, 230, .5)', height: '150px' }}>
              <Card.Content>
                <center><Icon name='users' size='huge' /></center>
                <center>
                  <h2>{this.props.customers.length - 1 === -1
                    ? 0
                    : this.props.customers.length - 1}</h2>
                </center>
                <Card.Header>
                  Registered Customers
                </Card.Header>
              </Card.Content>
            </Card>
          </div>
          <div className='col-lg-3'>
            <Card
              style={{ backgroundColor: 'rgba(0, 178, 0, .6)', height: '150px' }}>
              <Card.Content>
                <center><Icon inverted name='dollar' size='huge' /></center>
                <center>
                  <h2>{this.numberWithCommas(this.state.totalProfit)}</h2>
                </center>
                <Card.Header>
                  Profit
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    In Last Year
                  </span>
                </Card.Meta>
              </Card.Content>
            </Card>
          </div>
        </div> < Divider /> <div className='row'>
          <div className='col-lg-3'>
            <p>Most Sold Items</p>
            <div
              style={{
                height: '200px',
                overflowY: 'scroll'
              }}>
              <Feed>
                {this.state.mostSoldItems}
              </Feed>
            </div>
          </div>
          <div className='col-lg-3'>
            <p>Most Recent Receipts</p>
            <div
              style={{
                height: '200px',
                overflowY: 'scroll'
              }}>
              <Feed>
                {this.state.feedData}
              </Feed>
            </div>
          </div>
          <div className='col-lg-3'>
            <p>Most Frequest Customers</p>
            <div
              style={{
                height: '200px',
                overflowY: 'scroll'
              }}>
              <Feed>
                {this.state.mostFrequentCustomer}
              </Feed>
            </div>
          </div>
          <div className='col-lg-3'>
            <Card
              as={Link}
              to='/editCompany'
              style={{
                backgroundColor: 'rgba(253, 245, 230, .5)',
                height: '150px'
              }}>
              <Card.Content>
                <center><Icon name='edit' size='huge' /></center>
                <Card.Header>
                  <center>
                    <h2 style={{
                      marginTop: '25px'
                    }}>Edit Company Info</h2>
                  </center>
                </Card.Header>
              </Card.Content>
            </Card>
          </div>
        </div>
        <Modal show={this.state.initModal} > <Modal.Header closeButton>
          <Modal.Title>Register Company</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            <InitForm companyID={this.props.companyID} closeCompanyInfo={this.closeCompanyInfo} /> </Modal.Body>
          <Modal.Footer />
        </Modal>
      </div >
    );
  }
}
function mapStateToProps(state) {
  return {
    companyName: state.auth.company.companyName,
    companyID: state.auth.company.id,
    items: state.items.all,
    mostSoldItems: state.items.MostBought,
    receipts: state.viewReceipts.Receipts,
    customers: state.customer
  };
}

export default connect(mapStateToProps, { verifyInit, getMostPopularItems, populateList, viewReceipts, getCustomerList })(HomePage);
