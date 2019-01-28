import React from 'react';
import { connect } from "react-redux";
import * as reduxActions from "../js/reducers/index";
import { addToProfile } from "../js/functions/index";
import { personalizedEvents } from "../js/functions/index";
import Log from '../js/functions/log';



class InputText extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ""};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      event.preventDefault();
       // check to see if we have to use the default input if the user doesn't fill in an optional field
       var inputText = ""
       if(this.state.value !== ""){
         inputText = this.state.value
         Log.userAction("User submitted input: "+inputText, "Action", "start")
       } else {
         inputText = this.props.defaultInput
         Log.userAction("User submitted empty. Using default input: "+inputText, "Action", "start")
       }

      // special case for user input their own name (auto capitalize)
      if(this.props.id === "17xaepIPurDC2V6NjTZW62"){
          var capitalizedName = inputText.charAt(0).toUpperCase() + inputText.slice(1)
          var personalizedEventInfo= personalizedEvents(this, this.props.inputKey, capitalizedName)
          Log.trace("This is the special name field, so we are going to turn: "+inputText+" into "+capitalizedName, "Action")
          // We have to set this to use the changed variable (capitalizedName) so we don't have to loop through the setState callback.
          addToProfile(personalizedEventInfo.personalizedEventProfileAdd, this, capitalizedName);
      } else {
        personalizedEventInfo= personalizedEvents(this, this.props.inputKey, inputText)

        Log.trace("Executing the event associated with this action", "Action")
        // add all items to profile. We will loop through all the available profile add events.
        addToProfile(personalizedEventInfo.personalizedEventProfileAdd, this, inputText);
      }
      Log.trace(null,null,"end")
      
      // find the personalized event and set the contentBlockData to that
      let obj = this.props.contentBlock.props.lessonData.items[0].fields.contentBlocks.find(obj => obj.sys.id === personalizedEventInfo.personalizedEvent);
    this.props.contentBlock.setState({ contentBlockData: obj }, function() {
        Log.info("Successfully loaded component ContentBlock.js: "+this.state.contentBlockData.fields.title, "ContentBlock.js")
        Log.trace(null,null,"end")
        });
    }
  
    render() {
        Log.trace("Creating action (text input): "+this.props.inputPlaceholderText, "InputText.js", "start")
        // Disable submit button if input is required
      if(this.props.inputRequired === true){
        Log.trace("Input is required. Disable submit button unless there is text", "InputText.js")
        var submitJSX = <input type="submit" value={this.props.btnText} disabled={!this.state.value}/>
      } else {
        Log.trace("Input is not required. User can submit with empty input. Default value is: "+this.props.defaultInput, "InputText.js")  
        submitJSX = <input type="submit" value={this.props.btnText}/>
      }
      Log.trace(null, null, "end")

      return (
        <form onSubmit={this.handleSubmit} className="textInputForm">
          <input type="text" value={this.state.value} onChange={this.handleChange} placeholder={this.props.inputPlaceholderText}/>
          {submitJSX}
        </form>
      );
    }
  }

export default connect(reduxActions.mapAllStateToProps, reduxActions.mapAllDispatchToProps)(InputText);

