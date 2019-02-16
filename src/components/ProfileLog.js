import React from 'react';
import { connect } from "react-redux";

class ProfileLog extends React.Component {

    componentDidMount() {
        
    }
  
    componentWillUnmount() {
  
    }

    render(){

        // display only if debug mode is true

        let profileLogClass = "profileLog"

        if(this.props.debug === true){
            profileLogClass += "-active"
        }
        
        var listProfileItems = JSON.stringify(this.props, null, 2);

        return(
            <div className={profileLogClass}>
                <div className="profileTitle">User Profile</div>
                <div className="profileList">
                    <pre>
                        {listProfileItems}
                    </pre>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return { 
        name: state.name, 
        age: state.age, 
        emotionInvesting: state.emotionInvesting, 
        abilityBasicExpenses: state.abilityBasicExpenses,
        abilityCreditCard: state.abilityCreditCard,
        balanceCreditCard: state.balanceCreditCard,
        debug: state.debug };
  };


export default connect(mapStateToProps)(ProfileLog);

