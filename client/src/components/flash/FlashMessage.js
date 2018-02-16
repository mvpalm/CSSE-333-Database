import React, {Component} from 'react';
import classnames from 'classnames';

class FlashMessage extends Component {
    constructor(props) {
        super(props);
        this.onclick = this._onClick.bind(this);
    }

    _onClick() {
        console.log("click");
        this.props.deleteFlashMessage(this.props.message.id);
    }
    render() {
         console.log(this.props.message)
        const {id, type, text} = this.props.message
        return (
            <div
                className={classnames('alert', {
                'alert-success': type === 'success',
                'alert-danger': type === 'error'
            })}>
            <button onClick={this.onclick} className="close"><span>&times;</span></button>
                {text}
            </div>
        );
    }
}

FlashMessage.protoType = {
    message: React.PropTypes.object.isRequired,
    deleteFlashMessage: React.PropTypes.func.isRequired
}
export default  FlashMessage;