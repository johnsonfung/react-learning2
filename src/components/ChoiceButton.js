import React from 'react';


class ChoiceButton extends React.Component {
    render(){
        return(
           <div>
           {/*<button onClick={() => this.props.handler(this.props.destination)}>{this.props.linkText}</button>*/}
                <button onClick={() => this.props.handler(this.props.events[0].fields.eventDestination)}>{this.props.btnText}</button>
           </div>
        )
    }
}

export default ChoiceButton