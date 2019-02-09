import React from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import * as reduxActions from "../js/reducers/index";
import { addToProfile } from "../js/functions/index";
import { personalizedEvents } from "../js/functions/index";
import { findContentBlock } from "../js/functions/index";
import Log from '../js/functions/log';


class InputDropdown extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(selectedOption) {
      this.setState({ selectedOption });
    }
  
    handleSubmit(selectedOption) {
      selectedOption.preventDefault();

      // have to see if there's a dropdown option or to use the default dropdown option
      var dropdownOption = ""
      if(typeof this.state.selectedOption !== "undefined"){
        dropdownOption = this.state.selectedOption.value
        Log.userAction("User chose: "+dropdownOption, "Action", "start")
      } else {
        dropdownOption = this.props.dropdownDefaultChoice
        Log.userAction("User choose blank dropdown. Using default option: "+dropdownOption, "Action", "start")
      }

      var personalizedEventInfo= personalizedEvents(this, this.props.inputKey, dropdownOption)
      Log.trace("Executing the event associated with this action", "Action")
      // add all items to profile. We will loop through all the available profile add events.
      addToProfile(personalizedEventInfo.personalizedEventProfileAdd, this, dropdownOption);
      Log.trace(null,null,"end")

      // find the personalized event and set the contentBlockData to that
      let obj = findContentBlock(this.props.contentBlock.props.lessonData.items[0].fields.contentBlocks, personalizedEventInfo.personalizedEvent.sys.id)
      
      this.props.contentBlock.setState({ contentBlockData: obj }, function() {
        Log.info("Successfully loaded component ContentBlock.js: "+this.state.contentBlockData.fields.title, "ContentBlock.js")
        Log.trace(null,null,"end")
        });
    }
  
    render() {

      Log.trace("Creating action (dropdown input): "+this.props.inputPlaceholderText, "InputDropdown.js", "start")
      Log.trace(this.props.dropdownOptions, "InputDropdown.js")
      const { selectedOption } = this.state;
      
      // Disable submit button if input is required
      if(this.props.inputRequired === true){
        Log.trace("Input is required. Disable submit button unless there is an item selected.", "InputDropdown.js")
        var submitJSX = <input type="submit" value={this.props.btnText} disabled={!this.state.selectedOption}/>
      } else {
        Log.trace("Input is not required. User can submit with empty input. Default value is: "+this.props.dropdownDefaultChoice, "InputDropdown.js")  
        submitJSX = <input type="submit" value={this.props.btnText} />
      }

      const customStyles = {
        container: (provided, state) => ({
          ...provided,
          "width": "230px",
          "float": "left",
        }),
        control: (provided, state) => ({
          ...provided,
          "border-radius": "10px",
          "border-top-right-radius":"0px",
          "border-bottom-right-radius":"0px",
          "border-right-style": "none",
          "padding": "10px",
          "font-size": "18px",

          '&:hover': {
            "border-color": '#ccc'
          },
          '&:focus': {
            "border-color": '#ccc'
          },
            "boxShadow": "none",
            "border-color": '#ccc'
        }),
        dropdownIndicator: (provided, state) => ({
          ...provided,
          "transform": "scaleY(-1)"
        }),
        placeholder: (provided, state) => ({
          ...provided,
          "color":"#bbb"
        })
      }
      Log.trace(null,null,"end")

      return (
        <form onSubmit={this.handleSubmit} className="dropdownForm">
          <Select
            styles={customStyles}
            value={selectedOption}
            onChange={this.handleChange}
            options={this.props.dropdownOptions}
            menuPlacement="top"
            placeholder={this.props.inputPlaceholderText}
          />
        {submitJSX}
        </form>
      );
    }
  }

export default connect(reduxActions.mapAllStateToProps, reduxActions.mapAllDispatchToProps)(InputDropdown);

