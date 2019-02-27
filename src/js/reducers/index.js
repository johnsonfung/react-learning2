// All the actions
export const addEmoji = emoji => ({ type: "ADD_EMOJI", payload: emoji });
export const changeName = name => ({ type: "CHANGE_NAME", payload: name });
export const changeAge = age => ({ type: "CHANGE_AGE", payload: age });
export const changeEmotionInvesting = emotion => ({ type: "CHANGE_EMOTIONINVESTING", payload: emotion });
export const changeAbilityBasicExpenses = ability => ({ type: "CHANGE_ABILITYBASICEXPENSES", payload: ability });
export const changeAbilityCreditCard = ability => ({ type: "CHANGE_ABILITYCREDITCARD", payload: ability });
export const changeBalanceCreditCard = balance => ({ type: "CHANGE_BALANCECREDITCARD", payload: balance });

export const toggleDebug = debug => ({ type: "TOGGLE_DEBUG", payload: debug });


// All the mapDispatchToProps definitions
export const mapAllDispatchToProps = dispatch => {
    return {
        addEmoji: emoji => dispatch(addEmoji(emoji)),  
        changeName: name => dispatch(changeName(name)),
        changeAge: age => dispatch(changeAge(age)),
        changeEmotionInvesting: emotion => dispatch(changeEmotionInvesting(emotion)),
        changeAbilityBasicExpenses: ability => dispatch(changeAbilityBasicExpenses(ability)),
        changeAbilityCreditCard: ability => dispatch(changeAbilityCreditCard(ability)),
        changeBalanceCreditCard: balance => dispatch(changeBalanceCreditCard(balance)),
        toggleDebug: debug => dispatch(toggleDebug(debug))
    };
}

// All the mapStateToProps definitions

export const mapAllStateToProps = state => {
  return {
    emojis: state.emojis,
    name: state.name,
    age: state.age,
    emotionInvesting: state.emotionInvesting,
    abilityBasicExpenses: state.abilityBasicExpenses,
    abilityCreditCard: state.abilityCreditCard,
    balanceCreditCard: state.balanceCreditCard,
    debug: state.debug
  };
};

// The initial state
const initialState = {
  emojis: [],
  name: "Friend",
  age: 27,
  emotionInvesting: "unknown",
  abilityBasicExpenses: "unknown",
  abilityCreditCard: "unknown",
  balanceCreditCard: "unknown",
  debug: true
};

const revertToDefault = (field, action) => {
  if(action.payload === ""){
    return initialState[field]
  } else {
    return action.payload
  }
}

const rootReducer = (state = initialState, action) => {

  switch (action.type) {
    case "ADD_EMOJI":
      return { ...state, emojis: [...state.emojis, action.payload] };
    case "CHANGE_NAME":
      return {...state, name: revertToDefault("name", action)}
    case "CHANGE_AGE":
      return {...state, age: revertToDefault("age", action)}
    case "CHANGE_EMOTIONINVESTING":
      return {...state, emotionInvesting: revertToDefault("emotionInvesting", action)}
    case "CHANGE_ABILITYBASICEXPENSES":
      return {...state, abilityBasicExpenses: revertToDefault("abilityBasicExpenses", action)}
    case "CHANGE_ABILITYCREDITCARD":
      return {...state, abilityCreditCard: revertToDefault("abilityCreditCard", action)}
    case "CHANGE_BALANCECREDITCARD":
      return {...state, balanceCreditCard: revertToDefault("balanceCreditCard", action)}
    case "TOGGLE_DEBUG":
      return {...state, debug: action.payload}
    default:
      return state;
  }
};
export default rootReducer;