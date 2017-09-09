import { h, Component } from 'preact';
import leftPad from 'left-pad';
import Slider from './Slider';

const VOLUME_WIDTH = 100;
const SLIDER_WIDTH = 300;
const BLUE = '#3FB3D2';
const BLUE_DARK = '#1A83A1';
const BLUE_2 = '#00A0AD';
const WHITE = '#FFFFFF';

const getNextRate = currentRate => {
  const rates = [1, 1.25, 1.5, 2];
  const i = rates.indexOf(currentRate);
  return rates[i === rates.length - 1 ? 0 : i + 1];
}

const getMinutesAndSeconds = time => {
  return `${leftPad(Math.floor(time / 60), 2, '0')}:${leftPad(time % 60, 2, '0')}`
};

const MuteIcon = () =>
  <svg width="20" height="20" viewBox="0 0 100 100">
    <path d="M10.148,33.29v33.42h23.314l21.111,16.446V16.844L33.463,33.29H10.148z M74.477,50c0-8.232-5.002-15.315-12.125-18.379   v36.758C69.475,65.315,74.477,58.232,74.477,50z M62.352,15.52v7.226c11.826,3.423,20.5,14.341,20.5,27.255   s-8.674,23.832-20.5,27.255v7.226c15.727-3.591,27.5-17.682,27.5-34.48S78.078,19.11,62.352,15.52z" fill={WHITE} />
  </svg>

const UnmuteIcon = () =>
  <svg width="20" height="20" viewBox="0 0 100 100">
    <path d="M10.148,33.29v33.42h23.314l21.111,16.446V16.844L33.463,33.29H10.148z" fill={WHITE} />
  </svg>


const PlayIcon = () =>
  <svg width="40" height="40" viewBox="-5 0 25 20">
    <polygon points="0,0 0,20 20,10" fill="white" />
  </svg>

const PauseIcon = () =>
  <svg width="40" height="40" viewBox="-5 0 25 20">
    <path d="M0,0 L0,20 L5,20 L5,0 L0,0 M10,0 L10,20 L15,20 L15,0, L10,0" fill="white" />
  </svg>

const MARGIN_WIDTH = 20;
const PLAY_BUTTON_WIDTH = 100;
const PLAY_BUTTON_BORDER_WIDTH = 5;
const TIME_WIDTH = 40;
const RATE_WIDTH = 20;
const MUTE_WIDTH = 20;

class Widget extends Component {
  state = {
    isMuted: false,
    isPlaying: false,
    volume: 1,
    currentTime: null,
    duration: null,
    rate: 1,
    window: 0,
  };

  static defaultProps = {
    url: null
  };

  updateDimensions = () => {
    const componentWidth = this.component.offsetWidth;
    const fixedWidthItems = (MARGIN_WIDTH * 8) + PLAY_BUTTON_WIDTH + PLAY_BUTTON_BORDER_WIDTH * 2 + TIME_WIDTH * 2 + RATE_WIDTH + MUTE_WIDTH;
    const remainingSpace = componentWidth - fixedWidthItems;
    const extraSpace = remainingSpace < 100
      ? remainingSpace < 35
        ? TIME_WIDTH + MUTE_WIDTH + (MARGIN_WIDTH * 2)
        : TIME_WIDTH + MARGIN_WIDTH
      : 0;

    this.setState({
      timeSliderWidth: (remainingSpace + extraSpace) * 0.7,
      volumeSliderWidth: (remainingSpace + extraSpace) * 0.3,
      showRightTime: remainingSpace > 99,
      showMute: remainingSpace > 34,
    });
  };

  componentDidMount = () => {
    this.audio = document.getElementById('PreactAudioPlayer');
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
  };

  handlePlayClick = () => {
    this.setState({isPlaying: !this.state.isPlaying});

    if (this.state.isPlaying) {
      this.audio.play();
      this.audio.addEventListener('timeupdate', (event) => {
        this.setState({
          currentTime: Math.floor(this.audio.currentTime),
          duration: Math.floor(this.audio.duration),
        });
      }, false);
    } else {
      this.audio.pause();
    }
  };

  handleVolumeChange = volume => {
    this.setState({
      volume,
      isMuted: volume === 0,
    });
    this.audio.volume = volume;
  };

  handleTimeChange = percentTime => {
    this.setState({
      currentTime: Math.floor(this.state.duration * percentTime),
    });
    this.audio.currentTime = this.state.currentTime;
  };

  handleMuteClick = () => {
    this.setState({
      isMuted: !this.state.isMuted,
      volume: this.state.volume === 0 ? 0.5 : this.state.volume,
    });
    this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
  };

  handlePlaybackRate = () => {
    this.setState({
      rate: getNextRate(this.state.rate),
    });
    this.audio.playbackRate = this.state.rate;
  }

  render() {
    const {url} = this.props;
    const {isMuted, isPlaying, volume, currentTime, duration, rate} = this.state;
    const styles = {
      PreactAudioPlayer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        height: 50,
        margin: '40px 0',
        backgroundColor: BLUE_DARK,
        fontFamily: 'sans-serif',
      },
      PreactAudioPlayer__Play: {
        display: 'flex',
        flex: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        width: PLAY_BUTTON_WIDTH,
        height: PLAY_BUTTON_WIDTH,
        marginLeft: MARGIN_WIDTH,
        backgroundColor: BLUE,
        borderRadius: '50%',
        border: `${PLAY_BUTTON_BORDER_WIDTH}px solid ${BLUE_DARK}`,
        cursor: 'pointer',
      },
      PreactAudioPlayer__Time: {
        display: 'flex',
        color: WHITE,
      },
      PreactAudioPlayer__TimeLeft: {
        marginLeft: MARGIN_WIDTH,
        width: TIME_WIDTH,
      },
      PreactAudioPlayer__TimeSlider: {
        marginLeft: MARGIN_WIDTH,
      },
      PreactAudioPlayer__TimeRight: {
        width: TIME_WIDTH,
        marginLeft: MARGIN_WIDTH,
      },
      PreactAudioPlayer__Rate: {
        width: RATE_WIDTH,
        marginLeft: MARGIN_WIDTH,
        color: WHITE,
        cursor: 'pointer',
      },
      PreactAudioPlayer__Volume: {
        display: 'flex',
        marginRight: MARGIN_WIDTH,
      },
      PreactAudioPlayer__Mute: {
        width: MUTE_WIDTH,
        marginLeft: MARGIN_WIDTH,
        border: 'none',
        color: WHITE,
        background: 'none',
        cursor: 'pointer',
      },
      PreactAudioPlayer__VolumeSlider: {
        marginLeft: MARGIN_WIDTH,
      },
    };

    return (
      <div style={styles.PreactAudioPlayer} ref={e => this.component = e}>
        <audio id="PreactAudioPlayer">
          <source src={url} type="audio/mp3" />
        </audio>
        <button type="button" title="Play/Pause" aria-label="Play/Pause" style={styles.PreactAudioPlayer__Play} onClick={this.handlePlayClick}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div style={styles.PreactAudioPlayer__Time}>
          <div style={styles.PreactAudioPlayer__TimeLeft}>{getMinutesAndSeconds(currentTime)}</div>
          <div style={styles.PreactAudioPlayer__TimeSlider}>
            <Slider value={currentTime / duration || 0} width={this.state.timeSliderWidth} onChange={this.handleTimeChange} />
          </div>
          {this.state.showRightTime
            ? <div style={styles.PreactAudioPlayer__TimeRight}>{getMinutesAndSeconds(duration)}</div>
            : null}
        </div>
        <div style={styles.PreactAudioPlayer__Rate} onClick={this.handlePlaybackRate}>
          {rate}x
        </div>
        <div style={styles.PreactAudioPlayer__Volume}>
          {this.state.showMute
            ? <button type="button" title="Mute Toggle" aria-label="Mute Toggle" style={styles.PreactAudioPlayer__Mute} onClick={this.handleMuteClick}>
                {isMuted ? <UnmuteIcon /> : <MuteIcon />}
              </button>
            : null}
          <div style={styles.PreactAudioPlayer__VolumeSlider}>
            <Slider value={isMuted ? 0 : volume} width={this.state.volumeSliderWidth} onChange={this.handleVolumeChange} />
          </div>
        </div>
      </div>
    );
  }
}

export default Widget;
