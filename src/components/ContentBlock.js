import React from 'react';
import ChoiceButton from './ChoiceButton'
import * as reduxActions from "../js/reducers/index";
import { connect } from "react-redux";
import { addToProfile } from "../js/functions/index";
import { personalizeText } from "../js/functions/index";
import { conditionalActions } from "../js/functions/index";
import InputText from './InputText';
import InputDropdown from './InputDropdown';
import ReactAudioPlayer from 'react-audio-player';
import Log from '../js/functions/log';


class ContentBlock extends React.Component {
    // Props: firstLesson (obj), lessonData (obj)

    constructor(props) {
        super(props);
        this.state={
            contentBlockData: this.props.firstLesson,
        }
        this.handleClick = this.handleClick.bind(this);
      }
     
    handleClick(destinationContentBlock, profileAddArray, actionObject) {

        if(typeof actionObject !== "undefined"){
            if(actionObject.props.actionType === "button"){
                Log.userAction("User clicked: "+actionObject.props.buttonTitle, "Action", "start")
                Log.userAction(null,null,"end")
            }
        }
        
        // Let's find the content object that matches the id of the desitnation content block
        let obj = this.props.lessonData.items[0].fields.contentBlocks.find(obj => obj.sys.id === destinationContentBlock.sys.id);

        // This will add all profile adding dispatches included in the button action.
        addToProfile(profileAddArray, this);

        // This will change the current Content Block to the one defined in the Contentful field
        this.setState({ contentBlockData: obj }, function() {
            Log.info("Successfully loaded component ContentBlock.js: "+this.state.contentBlockData.fields.title, "ContentBlock.js")
            Log.trace(null,null,"end")
          });

    }

    componentDidMount() {
        Log.info("Successfully loaded component ContentBlock.js: "+this.state.contentBlockData.fields.title, "ContentBlock.js")
        Log.trace(null,null,"end")
    }
  
    componentWillUnmount() {
  
    }

    render(){

        // Logging
        Log.info("Attempting to load component ContentBlock.js: "+this.state.contentBlockData.fields.title, "ContentBlock.js", "start")
        Log.trace("ContentBlock title is: "+this.state.contentBlockData.fields.title+" ("+this.state.contentBlockData.sys.id+")", "ContentBlock.js")
        Log.trace(this.props.firstLesson, "ContentBlock.js")
        if(typeof this.props.lessonData === "undefined"){
            Log.error("Required prop missing: lessonData", "ContentBlock.js")
        }
        if(typeof this.props.firstLesson === "undefined"){
            Log.error("Required prop missing: firstLesson", "ContentBlock.js")
        }

        // DEFINING THE ACTIONS AVAILABLE
        var actionsArray = conditionalActions(this)
        var buttonArray = []
        var inputArray = []
        var dropdownArray = []

            // filter out actions for buttons and inputs
            for(var i=0; i<actionsArray.length; i++){
                if(actionsArray[i].fields.actionType === "button"){
                    buttonArray.push(actionsArray[i])
                } else if(actionsArray[i].fields.actionType === "input"){
                    inputArray.push(actionsArray[i])
                } else if(actionsArray[i].fields.actionType === "dropdown"){
                    // gotta do some work with dropdowns to grab the options
                    var dropdownActionTemp = {}
                    dropdownActionTemp = actionsArray[i]
                    dropdownActionTemp.dropdownOptions = []

                    // put all the options into the proper object format and add it to an object property
                    var x = actionsArray[i].fields.dropdownChoices.split(', ');
                    for(var t=0; t<x.length;t++){
                        dropdownActionTemp.dropdownOptions.push({value: x[t], label: x[t]})    
                    }
                    dropdownArray.push(dropdownActionTemp)
                } else {
                    Log.error("The action does not have an actionType: "+actionsArray.array[i].fields.title, "ContentBlock.js")
                    Log.error(actionsArray.array[i], "ContentBlock.js")
                }
            }

        // Personalize the text output in case there are any special variables like {name}
        if(typeof this.state.contentBlockData.fields.text !== "undefined"){
            var personalizedTextOutput = personalizeText(this.state.contentBlockData.fields.text, this)
        }
        
        // Audio
        if(typeof this.state.contentBlockData.fields.audioNarration !== "undefined"){
            Log.trace("Loading audio from: https:"+this.state.contentBlockData.fields.audioNarration.fields.file.url, "ContentBlock.js")
            var audioSrc = "https:"+ this.state.contentBlockData.fields.audioNarration.fields.file.url
        } else {
            audioSrc = ""
        }
        return(
            <div>
                <div className="contentBlockTitle">{this.state.contentBlockData.fields.title}</div>
                <div className="contentAudioPlayer">
                <ReactAudioPlayer
                    src={audioSrc}
                    autoPlay
                    //controls
                    />
                </div>
                <div className="contentBlockText"><p>{personalizedTextOutput}</p></div>
                <div className="contentBlockButtons">
                    {buttonArray.map(action =>
                            <ChoiceButton key={action.sys.id} buttonTitle={action.fields.title} actionType={action.fields.actionType} btnText={action.fields.buttonText} events={action.fields.eventsArray} handler={this.handleClick} conditions={action.fields.conditions} conditionAndOr={action.fields.conditionAndOr} defaultEvent={action.fields.defaultEvent}/>
                    )}
                    {inputArray.map(action =>
                            <InputText key={action.sys.id} id={action.sys.id} actionType={action.fields.actionType} inputKey={action.fields.inputKey} contentBlock={this} events={action.fields.eventsArray} defaultEvent={action.fields.defaultEvent} btnText={action.fields.buttonText} inputRequired={action.fields.inputRequired} defaultInput={action.fields.defaultInput} inputPlaceholderText={action.fields.inputPlaceholderText}/>
                    )}
                    {dropdownArray.map(action =>
                            <InputDropdown key={action.sys.id} id={action.sys.id} actionType={action.fields.actionType} inputKey={action.fields.inputKey} contentBlock={this} events={action.fields.eventsArray} defaultEvent={action.fields.defaultEvent} btnText={action.fields.buttonText} dropdownOptions={action.dropdownOptions} inputRequired={action.fields.inputRequired} dropdownDefaultChoice={action.fields.defaultInput} inputPlaceholderText={action.fields.inputPlaceholderText}/>
                    )}
                </div>
            </div>
        )
    }
}

export default connect(reduxActions.mapAllStateToProps, reduxActions.mapAllDispatchToProps)(ContentBlock);