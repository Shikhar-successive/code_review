import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import { getRandomNumber, getNextRoundRobin } from '../../libs/utils/math';

class Slider extends Component {
  id

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  componentDidMount() {
    let { index } = this.state;
    const { duration, random } = this.props;
    this.id = setInterval(() => {
      if (random) {
        const randomNumber = getRandomNumber();
        this.setState({ index: randomNumber });
      } else {
        const roundRobinNumber = getNextRoundRobin(4, index);
        if (index === 4) {
          index = 0;
        } else {
          index += 1;
        }
        this.setState({ index: roundRobinNumber });
      }
    }, duration);
  }

  componentWillUnmount() {
    clearInterval(this.id);
  }

  render() {
    const {
      alttext,
      banners,
      defaultbanner,
      height,
    } = this.props;
    const { index } = this.state;
    let image;
    if (banners[index] !== undefined) {
      image = <img height={height} src={banners[index]} alt={alttext} />;
    } else {
      image = <img height={height} src={defaultbanner} alt={alttext} />;
    }
    return (
      <>
        <div className="style_slider" style={{ marginTop: '10px' }}>
          <div>
            <div>
              {image}
            </div>
          </div>
        </div>
      </>
    );
  }
}
Slider.propTypes = {
  alttext: PropTypes.string,
  banners: PropTypes.instanceOf(Array),
  defaultbanner: PropTypes.string,
  duration: PropTypes.number,
  height: PropTypes.number,
  random: PropTypes.bool,
};
Slider.defaultProps = {
  alttext: PropTypes.defaultBanner,
  banners: PropTypes.array,
  defaultbanner: PropTypes.string,
  duration: PropTypes.number,
  height: PropTypes.number,
  random: PropTypes.bool,
};
export default Slider;
