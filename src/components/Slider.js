import { h, Component } from 'preact';

const BLUE = '#3FB3D2';
const BLUE_2 = '#00A0AD';
const WHITE = '#FFFFFF';

const getMinutesAndSeconds = time => {
  return `${leftPad(Math.floor(time / 60), 2, '0')}:${leftPad(time % 60, 2, '0')}`
};

class Slider extends Component {
  state = {
    leftEdge: 0,
    sliderWidth: 0,
    isDragging: false,
  };

  handleMouseMove = (e) => {
    if (this.state.isDragging) {
      const relativePosition = (e.x - this.state.leftEdge) / this.state.sliderWidth;
      const value = relativePosition < 0
          ? 0
          : relativePosition > 1
            ? 1
            : relativePosition;
      this.props.onChange(value);
    }
  };

  handleMouseUp = () => {
    this.setState({isDragging: false});
  };

  handleMouseDown = (e) => {
    e.preventDefault();
    this.setState({
      isDragging: true,
      leftEdge: e.x - e.offsetX,
      sliderWidth: e.target.clientWidth,
    });
    this.handleMouseMove(e);
  };

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  render() {
    const { value, width, onChange } = this.props;

    const styles = {
      PreactAudioPlayer__Slider: {
        position: 'relative',
        height: 20,
        width,
        backgroundColor: WHITE,
        borderRadius: 15,
        cursor: 'pointer',
      },
      PreactAudioPlayer__SliderHandle: {
        position: 'relative',
        height: 20,
        width: 20,
        top: -20,
        left: (value * width) - (value * 20),
        backgroundColor: BLUE,
        borderRadius: '50%',
        pointerEvents: 'none',
      },
      PreactAudioPlayer__SliderFill: {
        height: 20,
        width: (value * width) - (value * 20) + 20,
        backgroundColor: BLUE_2,
        borderRadius: 15,
        pointerEvents: 'none',
      },
    };

    return (
      <div style={styles.PreactAudioPlayer__Slider} onMouseDown={this.handleMouseDown}>
        <div style={styles.PreactAudioPlayer__SliderFill}></div>
        <div style={styles.PreactAudioPlayer__SliderHandle}></div>
      </div>
    );
  }
}

export default Slider;
