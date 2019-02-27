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
import AnimatedSvg from './AnimatedSvg';
import AnimatedImage from './AnimatedImage';
import ReactAudioPlayer from 'react-audio-player';
import Log from '../js/functions/log';
import parseSRT from 'parse-srt'
import {Animated} from "react-animated-css";
import Emoji from 'a11y-react-emoji';
import AnimatedFace from "./AnimatedFace";
import TweenMax from "gsap/TweenMax";
const reactStringReplace = require('react-string-replace');

class ContentBlock extends React.Component {
    // Props: firstLesson (obj), lessonData (obj)

    constructor(props) {
        super(props);
        this.state={
            viewHistory: [],
            contentBlockData: this.props.firstLesson,
            currentSubtitles: "",
            currentSubtitlesVisible: false,
            imageVisible: false,
            actionsVisible: false,
            faceEmotion: ""
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
        var viewHistory = this.state.viewHistory
        viewHistory.push(this.state.contentBlockData)
        viewHistory[viewHistory.length-1].profileAdds = profileAddArray
        this.setState({viewHistory: viewHistory}, function(){
            this.setState({contentBlockData: obj, actionsVisible: false, faceEmotion: "", imageVisible: true}, function() {
                Log.info("Successfully loaded component ContentBlock.js: "+this.state.contentBlockData.fields.title, "ContentBlock.js")
                Log.trace(null,null,"end")
            });
        })
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
        TweenMax.fromTo(this.wholeContentBlock, 1, {opacity:0}, {opacity:1, delay:1});
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
                var viewHistory = this.state.viewHistory
                viewHistory.push(this.state.contentBlockData)
                this.setState({viewHistory: viewHistory}, function(){
                    executeAutoAdvance(availableActions.autoAdvanceDestination, availableActions.autoAdvanceProfileAdd, this)
                })
            } else {
                if(this.state.actionsVisible !== true){
                    this.setState({actionsVisible: true});
                }
            }
        }

        //Subtitles & Face Animations Definitions
        var subtitlesSRT = this.state.contentBlockData.fields.subtitles
        var subtitlesJSON = parseSRT(subtitlesSRT)

        const onAudioListenFunction = () => {
            for(var i=0;i<subtitlesJSON.length;i++){
                if(Math.round( this.audioPlayer.audioEl.currentTime * 10) / 10 === Math.round( subtitlesJSON[i].start * 10) / 10){
                    this.setState({ currentSubtitles: subtitlesJSON[i].text, currentSubtitlesVisible: true }, function(){  

                        // EMOTIONS LIST

                        if(this.state.currentSubtitles.includes("improving") === true){
                            this.setState({faceEmotion: "sideTilt"}, function(){
                                this.setState({faceEmotion: ""})
                            });
                        } else if(this.state.currentSubtitles.includes("caught") === true){
                            this.setState({faceEmotion: "thinking"}, function(){
                                this.setState({faceEmotion: ""})
                            });
                        } else {
                            this.setState({faceEmotion: "neutral"}, function(){
                                this.setState({faceEmotion: ""})
                            });
                        }

                    });
                } else if(Math.round( this.audioPlayer.audioEl.currentTime * 10) / 10 === Math.round( subtitlesJSON[i].end * 10) / 10 && i+1 !== subtitlesJSON.length){
                    this.setState({currentSubtitlesVisible: false});
                }
            }
        }

        const skipAudio = () => {
            if(!isNaN(this.audioPlayer.audioEl.duration)){
                this.audioPlayer.audioEl.currentTime = this.audioPlayer.audioEl.duration
                this.setState({ currentSubtitles: subtitlesJSON[subtitlesJSON.length-1].text, currentSubtitlesVisible: true })
            }
        }

        const backToPrevious = () => {
            var immediatePreviousContent = this.state.viewHistory[this.state.viewHistory.length-1]
            var viewHistory = this.state.viewHistory
            viewHistory.pop();
            if(typeof immediatePreviousContent.profileAdds !== "undefined"){
                console.log("deleting state")
                for(var i=0;i<immediatePreviousContent.profileAdds.length;i++){
                    immediatePreviousContent.profileAdds[i].fields.value = ""
                }
                addToProfile(immediatePreviousContent.profileAdds, this);
            }
            // If we're backing right into the first contentBlock, show buttons and disable subtitles
            if(viewHistory.length === 0){
                this.setState({contentBlockData: immediatePreviousContent, viewHistory: viewHistory, actionsVisible: true, faceEmotion: "", imageVisible: true, currentSubtitlesVisible: false}, function(){         
                })    
            // Otherwise, show a normal mid-lesson setting
            } else {
                this.setState({contentBlockData: immediatePreviousContent, viewHistory: viewHistory, actionsVisible: false, faceEmotion: "", imageVisible: true}, function(){   
                })
            }
            
        }

        //Subtitle Replacements (Emojis and Names)
        var personalizedSubtitles = this.state.currentSubtitles

        // Note that text replacement has to go first, because once the Emojis are added, it is JSX and not a string
        personalizedSubtitles = personalizeText(personalizedSubtitles, this)

        // Replacing for Emojis
        const matchFunction = (match, z) => (
            <Emoji symbol={x.symbol} label={x.label} key={z}/>
        )

        for(var i=0; i<this.props.emojis.length;i++){
            var x = this.props.emojis[i]
            personalizedSubtitles = reactStringReplace(personalizedSubtitles, x.trigger, matchFunction)
        }

        // Animated SVG
        if(typeof this.state.contentBlockData.fields.animationDelay !== "undefined"){
            var animationDelay = Math.floor(this.state.contentBlockData.fields.animationDelay*1000)
        } else {
            animationDelay = true
            //note that "true" means 'no delay"...I know, it's confusing. False would make the svg appear instantly.
        }

        if(typeof this.state.contentBlockData.fields.animationDuration !== "undefined"){
            var animationDuration = Math.floor(this.state.contentBlockData.fields.animationDuration*1000)
        } else {
            animationDuration = 3000
        }

        if(typeof this.state.contentBlockData.fields.animationStagger !== "undefined"){
            var animationStagger = this.state.contentBlockData.fields.animationStagger
        } else {
            animationStagger = 100
        }

        if(typeof this.state.contentBlockData.fields.animatedSvg !== "undefined"){
            var animatedSvg = <AnimatedSvg svg={this.state.contentBlockData.fields.animatedSvg} duration={animationDuration} delay={animationDelay} stagger={animationStagger}/>
        } else if(typeof this.state.contentBlockData.fields.image !== "undefined"){
            animatedSvg = <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={this.state.imageVisible}><AnimatedImage src={this.state.contentBlockData.fields.image.fields.file.url}/></Animated>
        } else {
            animatedSvg = ""
        }

        return(
            <div ref={div => this.wholeContentBlock = div}>
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
                <div className="contentBlockText">
                    <p>{personalizedTextOutput}</p>
                    {animatedSvg}
                </div>
                <div className="contentBottomBlock">
                    <div className="contentBlockSubtitles">
                    <Animated animationIn="fadeInUp" animationOut="fadeOutDown" isVisible={this.state.currentSubtitlesVisible}>
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
                    <Animated animationIn="fadeIn" animationOut="instantOut" isVisible={!this.state.actionsVisible}>
                        <div className="contentBlockPermButtons">
                            <button className="permButtonSkip" onClick={() => backToPrevious()}>Back</button>
                            <button className="permButtonSkip" onClick={() => skipAudio()}>Skip</button>
                        </div>
                    </Animated>
                    <AnimatedFace faceEmotion={this.state.faceEmotion}/>
                </div>
            </div>
        )
    }
}

export default connect(reduxActions.mapAllStateToProps, reduxActions.mapAllDispatchToProps)(ContentBlock);