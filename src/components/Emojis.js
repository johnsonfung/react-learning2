import React from 'react';
import { connect } from "react-redux";
import * as reduxActions from "../js/reducers/index";
import * as contentful from 'contentful';
import Log from '../js/functions/log';

class Emojis extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        };
    }

    componentDidMount() {
        var client = contentful.createClient({
            space: '6gkeigxyxcpy',
            accessToken: 'a3ecbe25e1319fce737523dc37f9a63bf629f2930f2d5acf896b26b8669433b2' })
        
        Log.trace("Connecting to Contentful...", "Emojis.js")

        client.getEntries({
            include: 10,
            "sys.id": "1Sb6GCwBueKgmhEC8yjSnf"
            })
        .then((entry) => {
            for(var i=0; i<entry.includes.Entry.length; i++){
                var x = entry.includes.Entry[i].fields
                this.props.addEmoji({ symbol:x.symbol, label:x.label, trigger:x.trigger });
            }
        })
        .catch((error) => {
            Log.error("Couldn't connect to Contentful. Error: "+error, "Emojis.js")
        })
        Log.trace(null,null,"end")

    }
  
    componentWillUnmount() {
  
    }

    render() {
            // Return Component
            return(
                <div></div>
            )
  }
}

export default connect(reduxActions.mapAllStateToProps, reduxActions.mapAllDispatchToProps)(Emojis);;
