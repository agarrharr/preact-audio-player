import { h, Component } from 'preact';
import leftPad from 'left-pad';

const VOLUME_WIDTH = 100;
const BLUE = '#3FB3D2';
const BLUE_DARK = '#1A83A1';
const BLUE_2 = '#00A0AD';
const WHITE = '#FFFFFF';

const getMinutesAndSeconds = time => {
  return `${leftPad(Math.floor(time / 60), 2, '0')}:${leftPad(time % 60, 2, '0')}`
};

const PlayIcon = () =>
  <svg width="40" height="40" viewBox="-5 0 25 20">
    <polygon points="0,0 0,20 20,10" fill="white" />
  </svg>

const PauseIcon = () =>
  <svg width="40" height="40" viewBox="-5 0 25 20">
    <path d="M0,0 L0,20 L5,20 L5,0 L0,0 M10,0 L10,20 L15,20 L15,0, L10,0" fill="white" />
  </svg>

export default class Widget extends Component {
  state = {
    isMuted: false,
    isPlaying: false,
    volume: 1,
    currentTime: null,
    duration: null,
  };

  static defaultProps = {
    url: null
  };

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.audio = document.getElementById('PreactAudioPlayer');

    // this.interval = setInterval(() => this.setState({ currentTime: this.audio.currentTime }), 1000);
    // this.setState({ duration: this.audio.duration });
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

  handleVolumeChange = (volume) => {
    this.setState({volume});
    this.audio.volume = volume;
  };

  handleMuteClick = () => {
    this.setState({
      isMuted: !this.state.isMuted,
      volume: this.state.volume === 0 ? 0.5 : this.state.volume,
    });
    this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
  };

  handleMouseMove = (e) => {
    if (this.state.isVolumeChanging) {
      console.log(this.state.clientWidth);
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
      this.audio.volume = this.state.volume;
    }
  };

  handleVolumeMouseMove = (e) => {
  };

  handleVolumeMouseDown = (e) => {
    e.preventDefault();
    this.setState({
      isVolumeChanging: true,
      clientX: e.x - e.offsetX,
      clientWidth: e.target.clientWidth,
    });
  };

  handleMouseUp = () => {
    this.setState({isVolumeChanging: false});
  };

  render() {
    const {url} = this.props;
    const {isMuted, isPlaying, volume, currentTime, duration} = this.state;
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
      },
      PreactAudioPlayer__Time: {
        color: WHITE,
      },
      PreactAudioPlayer__Volume: {
        display: 'flex',
      },
      PreactAudioPlayer__Mute: {
        color: WHITE,
        marginRight: 20,
      },
      PreactAudioPlayer__VolumeSlider: {
        position: 'relative',
        height: 20,
        width: VOLUME_WIDTH,
        marginRight: 20,
        backgroundColor: WHITE,
        borderRadius: 15,
      },
      PreactAudioPlayer__VolumeSliderHandle: {
        position: 'relative',
        height: 20,
        width: 20,
        top: -20,
        left: isMuted ? 0 : (volume * (VOLUME_WIDTH - 20)),
        backgroundColor: BLUE,
        borderRadius: '50%',
        pointerEvents: 'none',
      },
      PreactAudioPlayer__VolumeSliderFill: {
        height: 20,
        width: isMuted ? 0 : (volume * (VOLUME_WIDTH - 20)) + 20,
        backgroundColor: BLUE_2,
        borderRadius: 15,
        pointerEvents: 'none',
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
          {getMinutesAndSeconds(currentTime)}/{getMinutesAndSeconds(duration)}
        </div>
        <div style={styles.PreactAudioPlayer__Volume} >
          <div style={styles.PreactAudioPlayer__Mute} onClick={this.handleMuteClick}>
            {isMuted ? 'Unmute' : 'Mute'}
          </div>
          <div style={styles.PreactAudioPlayer__VolumeSlider} onMouseMove={this.handleVolumeMouseMove} onMouseDown={this.handleVolumeMouseDown}>
            <div style={styles.PreactAudioPlayer__VolumeSliderFill}></div>
            <div style={styles.PreactAudioPlayer__VolumeSliderHandle}></div>
          </div>
        </div>
      </div>
    );
  }
}
