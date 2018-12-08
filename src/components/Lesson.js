import React from 'react';
import * as contentful from 'contentful';
import ContentBlock from './ContentBlock'

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
            accessToken: 'a3ecbe25e1319fce737523dc37f9a63bf629f2930f2d5acf896b26b8669433b2' })

        client.getEntries({
            include: 10,
            "sys.id": this.state.lessonId
            })
        .then((entry) => {
            this.setState({lessonData: entry});
        })
        .catch(console.error)

    }
  
    componentWillUnmount() {
  
    }

    render() {
        if(this.state.lessonData.items != null && typeof this.state.lessonData.items[0].fields != "undefined"){
            return(<div><p>The lesson name is: {this.state.lessonData.items[0].fields.title} </p>
            <ContentBlock firstLesson={this.state.lessonData.items[0].fields.contentBlocks[0]} lessonData={this.state.lessonData} />
            </div>)
        } else {
            return(<div><p>Loading...</p></div>)
        }
  }
}

export default Lesson;