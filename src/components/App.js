import React from 'react';
import Lesson from './Lesson';
import ProfileLog from './ProfileLog';
import { Provider } from "react-redux";
import store from "../js/store/index";
import Emojis from './Emojis';

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
                        <Emojis />    
                        <div className="app">
                            <Lesson entryId="1ecjYEtRnLETyqurjePS6M" />
                        </div>
                        <ProfileLog />
                    </Provider>  
                </div>
        )
        
  }
}



export default App;