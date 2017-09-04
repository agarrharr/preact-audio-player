import { h, Component } from 'preact';

const BLUE = '#3FB3D2';
const BLUE_2 = '#00A0AD';
const WHITE = '#FFFFFF';

const getMinutesAndSeconds = time => {
  return `${leftPad(Math.floor(time / 60), 2, '0')}:${leftPad(time % 60, 2, '0')}`
};

class Slider extends Component {
  state = {
    isVolumeChanging: false,
  };

  handleMouseMove = (e) => {
    if (this.state.isVolumeChanging) {
      const relativePosition = (e.x - this.state.clientX) / this.state.clientWidth;
      const volume = relativePosition < 0
          ? 0
          : relativePosition > 1
            ? 1
            : relativePosition;
      this.setState({
        isMuted: !volume,
        volume,
      });
      this.props.onChange(this.state.volume);
    }
  };

  handleMouseUp = () => {
    this.setState({isVolumeChanging: false});
  };

  handleVolumeMouseDown = (e) => {
    e.preventDefault();
    this.setState({
      isVolumeChanging: true,
      clientX: e.x - e.offsetX,
      clientWidth: e.target.clientWidth,
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
      PreactAudioPlayer__VolumeSlider: {
        position: 'relative',
        height: 20,
        width: width,
        marginRight: 20,
        backgroundColor: WHITE,
        borderRadius: 15,
      },
      PreactAudioPlayer__VolumeSliderHandle: {
        position: 'relative',
        height: 20,
        width: 20,
        top: -20,
        left: value,
        backgroundColor: BLUE,
        borderRadius: '50%',
        pointerEvents: 'none',
      },
      PreactAudioPlayer__VolumeSliderFill: {
        height: 20,
        width: value + 20,
        backgroundColor: BLUE_2,
        borderRadius: 15,
        pointerEvents: 'none',
      },
    };

    return (
      <div style={styles.PreactAudioPlayer__VolumeSlider} onMouseDown={this.handleVolumeMouseDown}>
        <div style={styles.PreactAudioPlayer__VolumeSliderFill}></div>
        <div style={styles.PreactAudioPlayer__VolumeSliderHandle}></div>
      </div>
    );
  }
}

export default Slider;
