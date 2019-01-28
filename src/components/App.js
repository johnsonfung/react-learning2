import React from 'react';
import ErrorBar from './ErrorBar';
import Lesson from './Lesson';
import ProfileLog from './ProfileLog';
import { Provider } from "react-redux";
import store from "../js/store/index";

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        };
    }

    render() {
        return(
                <div className="wrapper">
                    <Provider store={store}>      
                        <ErrorBar />
                        <div className="app">
                            <Lesson entryId="7iHYSjGgh4rXpiXKNQVF2J" />
                        </div>
                        <ProfileLog />
                    </Provider>  
                </div>
        )
        
  }
}



export default App;