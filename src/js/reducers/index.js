// All the actions
export const addArticle = article => ({ type: "ADD_ARTICLE", payload: article });
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
  articles: [],
  name: "Friend",
  age: 27,
  emotionInvesting: "unknown",
  abilityBasicExpenses: "unknown",
  abilityCreditCard: "unknown",
  balanceCreditCard: "unknown",
  debug: true
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ARTICLE":
      return { ...state, articles: [...state.articles, action.payload] };
    case "CHANGE_NAME":
      return {...state, name: action.payload}
    case "CHANGE_AGE":
      return {...state, age: action.payload}
    case "CHANGE_EMOTIONINVESTING":
      return {...state, emotionInvesting: action.payload}
    case "CHANGE_ABILITYBASICEXPENSES":
      return {...state, abilityBasicExpenses: action.payload}
    case "CHANGE_ABILITYCREDITCARD":
      return {...state, abilityCreditCard: action.payload}
    case "CHANGE_BALANCECREDITCARD":
      return {...state, balanceCreditCard: action.payload}
    case "TOGGLE_DEBUG":
      return {...state, debug: action.payload}
    default:
      return state;
  }
};
export default rootReducer;