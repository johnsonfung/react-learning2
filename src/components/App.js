import React from 'react';
import ErrorBar from './ErrorBar';
import Lesson from './Lesson';

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        };
    }

    render() {
        return(
            <div>        
                <ErrorBar />
                <Lesson entryId="66QfL6Z1DO08qiy6iyAUME" />
            </div>
        )
        
  }
}



export default App;