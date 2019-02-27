import React from 'react';
import TweenMax from "gsap/TweenMax";
import TweenLite from 'gsap/TweenLite';
import MorphSVGPlugin from '../js/functions/MorphSVGPlugin';

class AnimatedImage extends React.Component {
    constructor(props){
        super(props);
      }
    
      componentDidMount(){
      }

      componentDidUpdate(){
        
      }
    
      render(){
        return (
                <div className="contentImage" ref={div => this.contentImage = div}>
                    <img width="100%" height="100%" src={this.props.src} />
                </div>
        )
       
      }
}



export default AnimatedImage;
