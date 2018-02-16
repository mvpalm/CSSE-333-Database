import React, { Component } from 'react';
import Cards from './Cards';

class Greetings extends Component {
    render() {
        return (
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <h1 className="display-3">Hello, world!</h1>
                    <p className="lead">This is a web based management and inventory system. It is very inituitive and helpful. </p>
                    <hr className="my-4"></hr>
                    <p>To start, just create an account and sign in. You will then be able to add items and track the progression of the sales.</p>
                    <p className="lead">
                        <a className="btn btn-primary btn-lg" href="/signup" role="button">Sign Up</a>
                    </p>
                    <p>Created By Lance Dinh</p>
                </div>
                <hr className="my-4"></hr>
                <center><h2 className="display-3">Product Example</h2></center>
                <hr className="my-4"></hr>
              
            </div>
        )
    }
}
export default Greetings
