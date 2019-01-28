// All the actions
export const addArticle = article => ({ type: "ADD_ARTICLE", payload: article });
export const changeName = name => ({ type: "CHANGE_NAME", payload: name });
export const changeAge = age => ({ type: "CHANGE_AGE", payload: age });
export const changeCerealChoice = age => ({ type: "CHANGE_CEREALCHOICE", payload: age });
export const toggleDebug = debug => ({ type: "TOGGLE_DEBUG", payload: debug });


// All the mapDispatchToProps definitions
export const mapAllDispatchToProps = dispatch => {
    return {
        changeName: name => dispatch(changeName(name)),
        changeAge: age => dispatch(changeAge(age)),
        changeCerealChoice: cerealChoice => dispatch(changeCerealChoice(cerealChoice)),
        toggleDebug: debug => dispatch(toggleDebug(debug))
    };
}

// All the mapStateToProps definitions

export const mapAllStateToProps = state => {
  return {
    name: state.name,
    age: state.age,
    cerealChoice: state.cerealChoice,
    debug: state.debug
  };
};

// The initial state
const initialState = {
  articles: [],
  name: "Friend",
  age: 27,
  cerealChoice: "",
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
    case "CHANGE_CEREALCHOICE":
      return {...state, cerealChoice: action.payload}
    case "TOGGLE_DEBUG":
      return {...state, debug: action.payload}
    default:
      return state;
  }
};
export default rootReducer;