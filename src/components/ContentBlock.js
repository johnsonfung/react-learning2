import React from 'react';
import ChoiceButton from './ChoiceButton'
import * as reduxActions from "../js/reducers/index";
import { connect } from "react-redux";
import { addToProfile } from "../js/functions/index";
import { personalizeText } from "../js/functions/index";
import { renderActions } from "../js/functions/index";
import { executeAutoAdvance } from "../js/functions/index";
import { conditionalActions } from "../js/functions/index";
import { findContentBlock } from "../js/functions/index";
import InputText from './InputText';
import InputDropdown from './InputDropdown';
import ReactAudioPlayer from 'react-audio-player';
import Log from '../js/functions/log';
import parseSRT from 'parse-srt'
import {Animated} from "react-animated-css";
import Emoji from 'a11y-react-emoji'
const reactStringReplace = require('react-string-replace');

class ContentBlock extends React.Component {
    // Props: firstLesson (obj), lessonData (obj)

    constructor(props) {
        super(props);
        this.state={
            contentBlockData: this.props.firstLesson,
            currentSubtitles: "",
            currentSubtitlesVisible: false,
            actionsVisible: false,
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
        let obj = findContentBlock(this.props.lessonData.items[0].fields.contentBlocks, destinationContentBlock.sys.id)

        // This will add all profile adding dispatches included in the button action.
        addToProfile(profileAddArray, this);

        // This will change the current Content Block to the one defined in the Contentful field
        this.setState({ contentBlockData: obj, actionsVisible: false }, function() {
            Log.info("Successfully loaded component ContentBlock.js: "+this.state.contentBlockData.fields.title, "ContentBlock.js")
            Log.trace(null,null,"end")
          });

    }

    componentDidUpdate(){
    }

    componentDidMount() {
        if(typeof this.state.contentBlockData.fields.audioNarration === "undefined"){
            if(this.state.actionsVisible !== true){
                this.setState({actionsVisible: true});
            }
        } else {
            if(this.state.actionsVisible !== false){
                this.setState({actionsVisible: false});
            }
        }
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

        // Defining the actions available so render can loop through and display each type of action
        var availableActions = renderActions(conditionalActions(this), this)

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

        // When audio finishes playing function:
        const onAudioEndFunction = () => {
            // if there is autoAdvance actions 
            if(typeof availableActions.autoAdvanceDestination.fields !== "undefined"){
                executeAutoAdvance(availableActions.autoAdvanceDestination, availableActions.autoAdvanceProfileAdd, this)
            } else {
                if(this.state.actionsVisible !== true){
                    this.setState({actionsVisible: true});
                }
            }
        }

        //Subtitles
        var subtitlesSRT = this.state.contentBlockData.fields.subtitles
        var subtitlesJSON = parseSRT(subtitlesSRT)

        const onAudioListenFunction = () => {
            for(var i=0;i<subtitlesJSON.length;i++){
                if(Math.round( this.audioPlayer.audioEl.currentTime * 10) / 10 === Math.round( subtitlesJSON[i].start * 10) / 10){
                    this.setState({ currentSubtitles: subtitlesJSON[i].text, currentSubtitlesVisible: true });
                } else if(Math.round( this.audioPlayer.audioEl.currentTime * 10) / 10 === Math.round( subtitlesJSON[i].end * 10) / 10 && i+1 !== subtitlesJSON.length){
                    this.setState({currentSubtitlesVisible: false});
                }
            }
        }

        //Subtitle Replacements (Emojis and Names)
        var personalizedSubtitles = this.state.currentSubtitles

        // Note that text replacement has to go first, because once the Emojis are added, it is JSX and not a string
        personalizedSubtitles = personalizeText(personalizedSubtitles, this)

        // Replacing for Emojis
        const matchFunction = (match, i) => (
            <Emoji symbol={x.symbol} label={x.label} key={i}/>
        )

        for(var i=0; i<this.props.emojis.length;i++){
            var x = this.props.emojis[i]
            personalizedSubtitles = reactStringReplace(personalizedSubtitles, x.trigger, matchFunction)
        }


        return(
            <div>
                <div className="contentBlockTitle">{this.state.contentBlockData.fields.title}</div>
                <div className="contentAudioPlayer">
                <ReactAudioPlayer
                    src={audioSrc}
                    autoPlay
                    //controls
                    onEnded={onAudioEndFunction}
                    listenInterval={100}
                    onListen={onAudioListenFunction}
                    ref={(element) => { this.audioPlayer = element; }}
                    />
                </div>
                <div className="contentBlockText"><p>{personalizedTextOutput}</p></div>
                <div className="contentBottomBlock">
                    <div className="contentBlockSubtitles">
                    <Animated animationIn="fadeInUp" animationOut="fadeOut" isVisible={this.state.currentSubtitlesVisible}>
                            <div className="subtitlesText">
                                {personalizedSubtitles}
                            </div>
                        </Animated>
                    </div>
                    <Animated animationIn="fadeInUp" animationOut="instantOut" isVisible={this.state.actionsVisible}>
                        <div className="contentBlockButtons">
                            {availableActions.buttonArray.map(action =>
                                    <ChoiceButton key={action.sys.id} buttonTitle={action.fields.title} actionType={action.fields.actionType} btnText={action.fields.buttonText} events={action.fields.eventsArray} handler={this.handleClick} conditions={action.fields.conditions} conditionAndOr={action.fields.conditionAndOr} defaultEvent={action.fields.defaultEvent}/>
                            )}
                            {availableActions.inputArray.map(action =>
                                    <InputText key={action.sys.id} id={action.sys.id} actionType={action.fields.actionType} inputKey={action.fields.inputKey} contentBlock={this} events={action.fields.eventsArray} defaultEvent={action.fields.defaultEvent} btnText={action.fields.buttonText} inputRequired={action.fields.inputRequired} defaultInput={action.fields.defaultInput} inputPlaceholderText={action.fields.inputPlaceholderText}/>
                            )}
                            {availableActions.dropdownArray.map(action =>
                                    <InputDropdown key={action.sys.id} id={action.sys.id} actionType={action.fields.actionType} inputKey={action.fields.inputKey} contentBlock={this} events={action.fields.eventsArray} defaultEvent={action.fields.defaultEvent} btnText={action.fields.buttonText} dropdownOptions={action.dropdownOptions} inputRequired={action.fields.inputRequired} dropdownDefaultChoice={action.fields.defaultInput} inputPlaceholderText={action.fields.inputPlaceholderText}/>
                            )}
                        </div>
                    </Animated>
                </div>
            </div>
        )
    }
}

export default connect(reduxActions.mapAllStateToProps, reduxActions.mapAllDispatchToProps)(ContentBlock);