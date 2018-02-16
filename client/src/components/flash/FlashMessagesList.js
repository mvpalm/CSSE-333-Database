import React, {Component} from 'react';
import { connect } from 'react-redux';
import FlashMessage from './FlashMessage';
import { deleteFlashMessage } from '../../actions/flashMessages';
class FlashMessagesList extends Component {
    render() {
            console.log(this.props.messages);
        const messages = this.props.messages.map((mes) =>
            <FlashMessage key={mes.id} message={mes} deleteFlashMessage={this.props.deleteFlashMessage} />//to possibly list more than one flash message?
        )
        console.log(this.props.messages);
        return (
            <div>
                {messages}
            </div>
        );
    }
}

FlashMessagesList.protoTypes = {
    messages: React.PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        messages: state.flashMessages
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFlashMessage: (id) => dispatch(deleteFlashMessage(id)),
  };
};

export default connect(mapStateToProps,mapDispatchToProps )(FlashMessagesList);