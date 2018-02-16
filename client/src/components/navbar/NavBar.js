import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.logout = this._logout.bind(this);
  }

  _logout(e) {
    e.preventDefault();
    this.props.logout();

  }
  render() {
    const LoggedInLinks = (
      <Menu>
        <Menu.Menu>
          <Menu.Item as={Link} to='/home'>
            Digital Receipt
        </Menu.Item>
          <Menu.Item as={Link} to='/addItem'>
            Add/Delete Item
      </Menu.Item>

          <Dropdown item text='Receipt'>
            <Dropdown.Menu>
              <Menu.Item as={Link} to='/viewRecieptsPage'>
                View Receipt
      </Menu.Item>
              <Menu.Item as={Link} to='/createReceipt'>
                Create Receipt
      </Menu.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item as={Link} to='/inventory'>
            Transaction Log
      </Menu.Item>

        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item as={Link} to='/editCompany'>
            Edit Profile
      </Menu.Item>
          <Menu.Item onClick={this.logout}>
            Logout
      </Menu.Item>
        </Menu.Menu>
      </Menu>


    );
    const LoggedOutLinks = (
      <Menu>
        <Menu.Menu>
          <Menu.Item as={Link} to='/'>
            Digital Receipt
        </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item as={Link} to='/signup'>
            Signup
      </Menu.Item>
          <Menu.Item as={Link} to='/login'>
            Login
      </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
    const { isAuthenticated } = this.props.auth;
    console.log(isAuthenticated);

    return (
      <div>
        {isAuthenticated ? LoggedInLinks : LoggedOutLinks}

      </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (data) => dispatch(logout(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)