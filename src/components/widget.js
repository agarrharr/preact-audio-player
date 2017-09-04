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

class Widget extends Component {
  state = {
    isMuted: false,
    isPlaying: false,
    volume: 1,
    currentTime: null,
    duration: null,
    rate: 1,
  };

  static defaultProps = {
    url: null
  };

  componentDidMount() {
    this.audio = document.getElementById('PreactAudioPlayer');
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

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
        backgroundColor: BLUE_DARK,
        height: 50,
      },
      PreactAudioPlayer__Play: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        marginLeft: 20,
        backgroundColor: BLUE,
        borderRadius: '50%',
        border: `5px solid ${BLUE_DARK}`,
        cursor: 'pointer',
      },
      PreactAudioPlayer__Time: {
        display: 'flex',
        color: WHITE,
      },
      PreactAudioPlayer__TimeLeft: {
        marginRight: 20,
      },
      PreactAudioPlayer__TimeRight: {
      },
      PreactAudioPlayer__Rate: {
        color: WHITE,
      },
      PreactAudioPlayer__Volume: {
        display: 'flex',
      },
      PreactAudioPlayer__Mute: {
        color: WHITE,
        marginRight: 20,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
      },
    };


    return (
      <div style={styles.PreactAudioPlayer}>
        <audio id="PreactAudioPlayer">
          <source src={url} type="audio/mp3" />
        </audio>
        <button type="button" title="Play/Pause" aria-label="Play/Pause" style={styles.PreactAudioPlayer__Play} onClick={this.handlePlayClick}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div style={styles.PreactAudioPlayer__Time}>
          <div style={styles.PreactAudioPlayer__TimeLeft}>{getMinutesAndSeconds(currentTime)}</div>
          <Slider value={currentTime / duration || 0} width={SLIDER_WIDTH} onChange={this.handleTimeChange} />
          <div style={styles.PreactAudioPlayer__TimeRight}>{getMinutesAndSeconds(duration)}</div>
        </div>
        <div style={styles.PreactAudioPlayer__Rate} onClick={this.handlePlaybackRate}>
          {rate}x
        </div>
        <div style={styles.PreactAudioPlayer__Volume}>
          <button type="button" title="Mute Toggle" aria-label="Mute Toggle" style={styles.PreactAudioPlayer__Mute} onClick={this.handleMuteClick}>
            {isMuted ? <UnmuteIcon /> : <MuteIcon />}
          </button>
          <Slider value={isMuted ? 0 : volume} width={VOLUME_WIDTH} onChange={this.handleVolumeChange} />
        </div>
      </div>
    );
  }
}

export default Widget;
