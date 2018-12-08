import React from 'react';
import ChoiceButton from './ChoiceButton'

class ContentBlock extends React.Component {
    // Props: firstLesson (obj), lessonData (obj)

    constructor(props) {
        super(props);
        this.state={
            contentBlockData: this.props.firstLesson,
        }
        this.handleClick = this.handleClick.bind(this);
      }
      
    handleClick(destinationContentBlock) {

        let obj = this.props.lessonData.items[0].fields.contentBlocks.find(obj => obj.sys.id === destinationContentBlock);

        this.setState(state => ({
            contentBlockData: obj,
        }));
    }

    componentDidMount() {
        
    }
  
    componentWillUnmount() {
  
    }

    render(){
        var actionData = this.state.contentBlockData.fields.actionBlocks

        return(
            <div>
                <h1>{this.state.contentBlockData.fields.title}</h1>
                {actionData.map(action =>
                    <div key={action.sys.id}>
                        <ChoiceButton key={action.sys.id} btnText={action.fields.buttonText} events={action.fields.eventsArray} handler={this.handleClick}/>
                    </div>
                )}
            </div>
        )
    }
}

export default ContentBlock;