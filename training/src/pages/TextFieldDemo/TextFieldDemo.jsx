import React, { Component } from 'react';
import { TextField, Slider } from '../../components';

class TextFieldDemo extends Component {
  render() {
    return (
      <>
        <Slider
          alttext="Default Banner"
          banners={['/images/cloud.jpg',
            '/images/js.jpg',
            '/images/load-balancer.png',
            '/images/full-stack-web-development.jpg',
            '/images/dns-server.png']}
          defaultbanner="/banners/default.png"
          duration={2000}
          height={200}
          random={false}
        />
        <p>This is Disabled Input</p>
        <TextField
          value="disabled input"
          disabled
        />
        <p>A Valid Input</p>
        <TextField
          value="Accessible"
        />
        <p>An Input with Error</p>
        <TextField
          value="101"
          error="Could not be greater than"
          pattern="[A-Za-z]+"
        />
      </>
    );
  }
}

export default TextFieldDemo;
