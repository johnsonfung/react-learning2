import React from 'react';
import * as contentful from 'contentful';
import ContentBlock from './ContentBlock'
import Log from '../js/functions/log';

class Lesson extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          lessonId: this.props.entryId,
          lessonData: {}
        };
    }

    componentDidMount() {
        var client = contentful.createClient({
            space: '6gkeigxyxcpy',
            accessToken: '11124d798eb4964e0b2fbbe93f4be266f94187a4b6137a965140e92855ba8c8a'
        })
        
        Log.trace("Connecting to Contentful...", "Lesson.js")

        client.getEntries({
            include: 10,
            "sys.id": this.state.lessonId
            })
        .then((entry) => {
            this.setState({lessonData: entry});
        })
        .catch((error) => {
            Log.error("Couldn't connect to Contentful. Error: "+error, "Lesson.js")
        })
        Log.trace(null,null,"end")

    }
  
    componentWillUnmount() {
  
    }

    render() {

        if(this.state.lessonData.items != null && typeof this.state.lessonData.items[0].fields != "undefined"){
           
            // Logging 

            Log.trace("Lesson data with id:"+this.props.entryId+" successful retrieved from Contentful.", "Lesson.js", "start")
            if(this.state.lessonData.items.length > 0 && this.state.lessonData.items[0].fields.title && this.state.lessonData.items[0].fields.contentBlocks[0]){
                Log.info("Lesson loaded from Contentful: "+this.state.lessonData.items[0].fields.title+" and it has "+this.state.lessonData.items[0].fields.contentBlocks.length+" content blocks.", "Lesson.js")
                Log.trace(this.state.lessonData, "Lesson.js")
            } else {
                Log.error("Lesson ("+this.props.entryId+") doesn't have either a) an items array b) a title c) at least one content block", "Lesson.js")
            }
            // Return Component
            return(
                <div>
                    <div className="lessonTitle">{this.state.lessonData.items[0].fields.title}</div>
                    <ContentBlock firstLesson={this.state.lessonData.items[0].fields.contentBlocks[0]} lessonData={this.state.lessonData} />
                </div>
            )
        } else {
            Log.warn("Still loading Lesson data with id:"+this.props.entryId+" from Contentful. If message persists, check connection or on this.state.lessonData.items to make sure there are items.", "Lesson.js")
            return(<div className="lessonTitle"><p>Loading... (check internet connection)</p></div>)
        }
  }
}

export default Lesson;