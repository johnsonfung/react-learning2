import React from 'react';
import { connect } from "react-redux";
import { personalizedEvents } from "../js/functions/index";
import * as reduxActions from "../js/reducers/index";
import Log from '../js/functions/log';

class ChoiceButton extends React.Component {

    componentDidMount() {
    }
  
    componentWillUnmount() {
  
    }

    render(){
        Log.trace("Creating action (button): "+this.props.btnText, "ChoiceButton.js", "start")

        // use the function to figure out if the buttons have personalized destinations
        Log.trace("Personalizing the event for the action...", "ChoiceButton.js")
        var personalizedEventInfo = personalizedEvents(this)
            // use the return from the function to set the destination and profile add of the button
            var personalizedEvent = personalizedEventInfo.personalizedEvent
            var personalizedEventProfileAdd = personalizedEventInfo.personalizedEventProfileAdd
        
        // Define the button output
        var output = <button className="choiceButton" onClick={() => this.props.handler(personalizedEvent, personalizedEventProfileAdd, this)}>{this.props.btnText}</button>
        Log.trace(null,null,"end")
        return(
            <div className="buttonWrapper">
                {output}
            </div>
        )
    }
}

export default connect(reduxActions.mapAllStateToProps)(ChoiceButton);

