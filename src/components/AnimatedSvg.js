import React from 'react';
import SvgLines from 'react-mt-svg-lines'; 

class AnimatedSvg extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          animate: true,
        };
    }

    componentDidMount() {
    }
  
    componentWillUnmount() {
  
    }

    componentDidUpdate(){
    }

    render() {
            // Return Component

            // THE BELOW CODE IS ONLY BECAUSE CONTENTFUL ISNT UPDATING WITH CONTENTFUL.JS
            var svgData = ""
            if(1===3){
                console.log("using debug svg")
                svgData = '<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 325 458"><title>mcdonalds</title><path id="outlineTop" d="M73.76 216.54 93.67 164.47 226.91 164.47 246.06 216.54 73.76 216.54z" fill="none" stroke="#e84b24" stroke-miterlimit="10" stroke-width="5"/><path id="outlineBottom" d="M73.76 220.37 93.67 339.45 226.53 339.45 246.06 220.37 73.76 220.37z" fill="none" stroke="#b72025" stroke-miterlimit="10" stroke-width="4"/><path id="fillTopBox" d="M90.97 171.53 227.6 171.53 88.01 186.97 231.44 186.97 82.46 200.63 236.14 200.63 75.91 210.92 241.26 210.92" fill="none" stroke="#e84b24" stroke-miterlimit="10" stroke-width="13"/><path id="fillBottomBox" d="M77.34 233 87.66 224.58 105.61 224.73 82.45 242.62 85.47 260.77 120.09 224.85 140.64 226.16 89.18 269.76 89.58 289.29 154.37 226.98 170.07 225.52 91.84 297.42 94.8 312.03 185.94 225.09 198.6 224.48 94.76 319.11 99.73 332.29 211.81 224.32 223.93 227.48 110.75 334.88 129.55 335.1 236.74 225.01 143.59 333.58 162.5 334.01 240.18 231.38 172.98 332.94 188.97 331.85 236.5 255.8 199.99 332.29 217.27 332.07 233.05 269.76" fill="none" stroke="#b72025" stroke-linejoin="round" stroke-width="12"/><path id="smileLeft" d="M104.77,267.51,120.09,256" transform="translate(0 8)" fill="none" stroke="#eac01e" stroke-miterlimit="10" stroke-width="6"/><path id="smileRight" d="M213.9,265.59l-13-9.57" transform="translate(0 8)" fill="none" stroke="#e8be1f" stroke-miterlimit="10" stroke-width="6"/><path id="smileMiddle" d="M114.73,261.76s42.76,55.33,92.66,0" transform="translate(0 8)" fill="none" stroke="#eac01e" stroke-miterlimit="10" stroke-width="5"/><path id="topM" d="M102.75,152c0-9.64,2-29.06,26.19-29.06,26.41,0,29.74,28.72,29.74,28.72s3.82-27.9,28.86-27.9c15.3,0,27.08,18.17,27.08,28.24" transform="translate(0 8)" fill="none" stroke="#eac01e" stroke-linecap="square" stroke-linejoin="round" stroke-width="14"/><line id="framerLine" y1="8" y2="458" fill="none"/><line id="framerLine2" x1="325" x2="325" y2="450" fill="none"/></svg>'
            } else {
                svgData = this.props.svg
            }

            return(
                <div className="svg">
                    <SvgLines animate={this.props.delay} duration={this.props.duration} stagger={this.props.stagger}>
                    <div className="Container" dangerouslySetInnerHTML={{__html:svgData}}></div>
                    </SvgLines>
              </div>
            )
  }
}

export default AnimatedSvg;
