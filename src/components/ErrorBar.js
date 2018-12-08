import React from 'react';


class ErrorBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMessage: ""
        }
    }

    render(){

        let errorMessage;

        if(this.state.errorMessage !== ""){
            errorMessage = <div className="errorBar">{this.state.errorMessage}</div>;
        } else {
            errorMessage = <div className="errorBarHidden"></div>
        }

        return(
           <div>{errorMessage}</div>
        )
    }
}

export default ErrorBar