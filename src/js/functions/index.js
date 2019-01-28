import Log from './log';

// Runs through an array of Contentful dispatchArrays and adds them to the store
export function addToProfile(dispatchArray, that, input){
    if(typeof dispatchArray !== "undefined"){
        for(var i=0;i<dispatchArray.length;i++){
            if(dispatchArray[i].fields.inputOrDefined === "input" && typeof input !== "undefined" && input !== ""){
                that.props[dispatchArray[i].fields.field](input);
                Log.addToProfile("Modifying profile field: "+dispatchArray[i].fields.field+" -> "+input, "addToProfile()", "start")
            } else {
                that.props[dispatchArray[i].fields.field](dispatchArray[i].fields.value);
                Log.addToProfile("Modifying profile field: "+dispatchArray[i].fields.field+" -> "+dispatchArray[i].fields.value, "addToProfile()", "start")
            }
            Log.addToProfile(null,null,"end")
        }
    }
}

// Checks the component to see if there are conditions for its display - mostly used for buttons
export function conditionalDisplay(that, buttonObject){
    if(typeof buttonObject.fields.conditions !== "undefined"){
                
        // pass the props as a variable the function can use
        var props = that.props

        // that will be used to check against the whole array of conditions
        function checkCondition(condition){
            // Define the key and value that is the condition

            var key = condition.fields.key
            var value = condition.fields.value
            
            // Logging
            Log.trace("Checking if `"+key+"` is `"+condition.fields.logic+"` `"+value+"`...", "conditionalDisplay()", "start")

            // Figure out the operator and do the validation to see if the condition value matches the value in the store
            switch(condition.fields.logic){
                case "is":
                    if(props[key] === value){
                        Log.trace("True!", "conditionalDisplay()")
                        return true
                    } else {
                        Log.trace("Nope!", "conditionalDisplay()")
                        return false
                    }
                case "isNot":
                    if(props[key] !== value){
                        Log.trace("True!", "conditionalDisplay()")
                        return true
                    } else {
                        Log.trace("Nope!", "conditionalDisplay()")
                        return false
                    }
                case "isGreaterThan":
                    if(props[key] > value){
                        Log.trace("True!", "conditionalDisplay()")
                        return true
                    } else {
                        Log.trace("Nope!", "conditionalDisplay()")
                        return false
                    }
                case "isLessThan":
                    if(props[key] < value){
                        Log.trace("True!", "conditionalDisplay()")
                        return true
                    } else {
                        Log.trace("Nope!", "conditionalDisplay()")
                        return false
                    }
                default:
                    Log.error("No conditional logic is defined. Please define it in Contentful for action: "+buttonObject.sys.id, "conditionalDisplay()")
                    return false;
            }
        }

        // if all conditions have to be true
        if(buttonObject.fields.conditionAndOr === "all"){
            
            if(buttonObject.fields.conditions.every(checkCondition) === true){
                Log.trace("Every condition needs to be true, and it is.", "conditionalDisplay()")
                Log.error(null, null, "end")
                return true
            } else {
                Log.trace("Every condition needs to be true, and they are *not*.", "conditionalDisplay()")
                Log.error(null, null, "end")
                return false
            }
        } else {
        // if only any of the conditions have to be true
            if(buttonObject.fields.conditions.some(checkCondition) === true){
                Log.trace("Only one of the conditions needs to be true, and it is.", "conditionalDisplay()")
                Log.error(null, null, "end")
                return true
            } else {
                Log.trace("Only one of the conditions needs to be true, and none of them are.", "conditionalDisplay()")
                Log.error(null, null, "end")
                return false
            }
        }
    } else {
        Log.trace("No condiitons were defined.", "conditionalDisplay()", "start")
        Log.error(null, null, "end")
        return true
    }
}

export function conditionalActions(that){
    Log.trace("Using conditionalActions() to decide what actions are available.", "conditionalActions()", "start")
    var buttonArray = []
        if(typeof that.state.contentBlockData.fields.actionBlocks !== "undefined"){
            Log.trace("Looks like there are "+that.state.contentBlockData.fields.actionBlocks.length+" conditional actions.", "conditionalActions()")
            var actionData = that.state.contentBlockData.fields.actionBlocks
            // create an array for the buttons that pass the conditional checks
            // check each button for conditional display
            for(var i=0; i<actionData.length; i++){
                Log.trace("Using conditionalDisplay() against: "+actionData[i].fields.title, "conditionalActions()")
                if(conditionalDisplay(that, actionData[i]) === true){
                    // add the button to the array
                    Log.trace("Condition passed! Displaying action ("+actionData[i].fields.actionType+"): "+actionData[i].fields.title, "conditionalActions()")
                    buttonArray.push(actionData[i])
                } else {
                    Log.trace("Condition failed! Hiding action ("+actionData[i].fields.actionType+"): "+actionData[i].fields.title, "conditionalActions()")
                }
            }
            // if none of the actions pass their conditions, show default
            if(buttonArray.length === 0){
                Log.trace("None of the conditional actions passed conditionalDisplay. Displaying default actions.", "conditionalActions()")
                for(var t=0; t<that.state.contentBlockData.fields.defaultActions.length; t++){
                    buttonArray.push(that.state.contentBlockData.fields.defaultActions[t])
                    Log.trace("Displaying action ("+that.state.contentBlockData.fields.defaultActions[t].fields.actionType+"): "+that.state.contentBlockData.fields.defaultActions[t].fields.title, "conditionalActions()")
                }
                Log.trace(buttonArray, "conditionalActions()")
                Log.trace(null, null, "end")
                return buttonArray
            } else {
                Log.trace(buttonArray, "conditionalActions()")
                Log.trace(null, null, "end")
                return buttonArray
            }
        // If there are no conditional actions to begin with, show default actions
        } else {
            Log.trace("Looks like there are only default actions (no conditional actions).", "conditionalActions()")
            for(var s=0; s<that.state.contentBlockData.fields.defaultActions.length; s++){
                buttonArray.push(that.state.contentBlockData.fields.defaultActions[s])
                Log.trace("Displaying action ("+that.state.contentBlockData.fields.defaultActions[s].fields.actionType+"): "+that.state.contentBlockData.fields.defaultActions[s].fields.title, "conditionalActions()")
            }
            Log.trace(buttonArray, "conditionalActions()")
            Log.trace(null, null, "end")
            return buttonArray
        }
}

export function conditionalEvents(that, event, inputKey, inputValue){
    if(typeof event.conditions !== "undefined"){
                
        // pass the props as a variable the function can use
        var props = that.props

        // that will be used to check against the whole array of conditions
        /* note that I screwed up this function below checkCondition(). 
        It requires the vairables inputKey and inputValue, 
        but I didn't put them as parameters because later when I call .every and .some, 
        I'm not sure how to add more parameters.*/
        function checkCondition(condition){
            // Define the key and value that is the condition
            var key = condition.fields.key
            var value = condition.fields.value
            
            Log.trace("Checking if `"+key+"` is `"+condition.fields.logic+"` `"+value+"`...", "conditionalEvents()", "start")
            // In case the condition is related to an input the user put in
            if(typeof inputKey !== "undefined"){
                if(key === inputKey){
                    switch(condition.fields.logic){
                        case "is":
                            if(inputValue === value){
                                Log.trace("True!", "conditionalEvents()")
                                return true
                            } else {
                                Log.trace("Nope!", "conditionalEvents()")
                                return false
                            }
                        case "isNot":
                            if(inputValue !== value){
                                Log.trace("True!", "conditionalEvents()")
                                return true
                            } else {
                                Log.trace("Nope!", "conditionalEvents()")
                                return false
                            }
                        case "isGreaterThan":
                            if(inputValue > value){
                                Log.trace("True!", "conditionalEvents()")
                                return true
                            } else {
                                Log.trace("Nope!", "conditionalEvents()")
                                return false
                            }
                        case "isLessThan":
                            if(inputValue < value){
                                Log.trace("True!", "conditionalEvents()")
                                return true
                            } else {
                                Log.trace("Nope!", "conditionalEvents()")
                                return false
                            }
                        default:
                            Log.trace("No conditional logic is defined. Please define it in Contentful", "conditionalEvents()")
                            return false;
                        
                    }
                } else {
                    // Figure out the operator and do the validation to see if the condition value matches the value in the store
                    switch(condition.fields.logic){
                        case "is":
                            if(props[key] === value){
                                Log.trace("True!", "conditionalEvents()")
                                return true
                            } else {
                                Log.trace("Nope!", "conditionalEvents()")
                                return false
                            }
                        case "isNot":
                            if(props[key] !== value){
                                Log.trace("True!", "conditionalEvents()")
                                return true
                            } else {
                                Log.trace("Nope!", "conditionalEvents()")
                                return false
                            }
                        case "isGreaterThan":
                            if(props[key] > value){
                                Log.trace("True!", "conditionalEvents()")
                                return true
                            } else {
                                Log.trace("Nope!", "conditionalEvents()")
                                return false
                            }
                        case "isLessThan":
                            if(props[key] < value){
                                Log.trace("True!", "conditionalEvents()")
                                return true
                            } else {
                                Log.trace("Nope!", "conditionalEvents()")
                                return false
                            }
                        default:
                            Log.trace("No conditional logic is defined. Please define it in Contentful", "conditionalEvents()")
                            return false;
                    }
                }
            } else {
                // Figure out the operator and do the validation to see if the condition value matches the value in the store
                switch(condition.fields.logic){
                    case "is":
                        if(props[key] === value){
                            Log.trace("True!", "conditionalEvents()")
                            return true
                        } else {
                            Log.trace("Nope!", "conditionalEvents()")
                            return false
                        }
                    case "isNot":
                        if(props[key] !== value){
                            Log.trace("True!", "conditionalEvents()")
                            return true
                        } else {
                            Log.trace("Nope!", "conditionalEvents()")
                            return false
                        }
                    case "isGreaterThan":
                        if(props[key] > value){
                            Log.trace("True!", "conditionalEvents()")
                            return true
                        } else {
                            Log.trace("Nope!", "conditionalEvents()")
                            return false
                        }
                    case "isLessThan":
                        if(props[key] < value){
                            Log.trace("True!", "conditionalEvents()")
                            return true
                        } else {
                            Log.trace("Nope!", "conditionalEvents()")
                            return false
                        }
                    default:
                        Log.trace("No conditional logic is defined. Please define it in Contentful", "conditionalEvents()")
                        return false;
                }
            }
            // In case the condition is looking at the overall user profile
        
        }

        // if all conditions have to be true
        if(event.conditionAndOr === "all"){
            
            if(event.conditions.every(checkCondition) !== true){
                // remove output if condition aren't met
                Log.trace("Every condition needs to be true, and it is *not*.", "conditionalEvents()")
                Log.error(null, null, "end")
                return false
            } else {
                Log.trace("Every condition needs to be true, and it is.", "conditionalEvents()")
                Log.error(null, null, "end")
                return true
            }
        } else {
        // if only any of the conditions have to be true
            if(event.conditions.some(checkCondition) !== true){
                // remove output if conditions aren't met
                Log.trace("Only one condition needs to be true, and none of them are.", "conditionalEvents()")
                Log.error(null, null, "end")
                return false
            } else {
                Log.trace("Only one condition needs to be true, at least one is.", "conditionalEvents()")
                Log.error(null, null, "end")
                return true
            }
        }
    } else {
        Log.trace("No condiitons were defined.", "conditionalEvents()", "start")
        Log.error(null, null, "end")
        return true
    }
}

export function personalizedEvents(that, inputKey, inputValue){

    if(typeof that.props.events !== "undefined"){
        var stoppedLoop = false;
        Log.trace("Conditional events exist, will loop through to see which is relevant.", "personalizedEvents()", "start")
        for(var i=0; i<that.props.events.length; i++){
            var event = that.props.events[i].fields
            if(conditionalEvents(that, event, inputKey, inputValue) === true){
                stoppedLoop = true;
                Log.trace("Conditions met. Will use conditional event: "+that.props.events[i].fields.title, "personalizedEvents()")
                Log.trace(null,null,"end")
                return {"personalizedEvent": that.props.events[i].fields.eventDestinationRef, "personalizedEventProfileAdd": that.props.events[i].fields.profileAdd}
            }
        // if none of the conditions are met, then use the defaultEvent
        } if(stoppedLoop === false) {
            Log.trace("Conditions *not* met. Will use defaultEvent: "+that.props.defaultEvent.fields.title, "personalizedEvents()")
            Log.trace(null,null,"end")
            return {"personalizedEvent": that.props.defaultEvent.fields.eventDestinationRef, "personalizedEventProfileAdd": that.props.defaultEvent.fields.profileAdd}
        }
    } else {
        // if there are no conditional events, then use the default event
        Log.trace("There are no conditional events. Will use defaultEvent: "+that.props.defaultEvent.fields.title, "personalizedEvents()", "start")
        Log.trace(null,null,"end")
        return {"personalizedEvent": that.props.defaultEvent.fields.eventDestinationRef, "personalizedEventProfileAdd": that.props.defaultEvent.fields.profileAdd}
    }
}

export function personalizeText(inputText, that){
    Log.trace("Personalizing text...", "personalizeText()", "start")
    if(typeof inputText !== "undefined"){
        var personalizedText = inputText.replace( /{name}/g, that.props.name)
        Log.trace("Replaced {name} with {"+that.props.name+"}", "personalizeText()")
    } else {
        personalizedText = ""
    }
    Log.trace(null, null, "end")
    return personalizedText
}
