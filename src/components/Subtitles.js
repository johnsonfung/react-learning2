import React from 'react';
import Log from '../js/functions/log';

class Subtitles extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          currentSubtitles: "",
        }
      }

    componentDidMount() {
    }
  
    componentWillUnmount() {
  
    }

    componentWillReceiveProps(props) {
        this.setState({ currentSubtitles: props.text })
      }

    render(){
        return(
            <div className="subtitlesWrapper">
                <p>{this.state.currentSubtitles}</p>
            </div>
        )
    }
}

export default Subtitles;

