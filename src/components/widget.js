import { h, Component } from 'preact';

const VOLUME_WIDTH = 20;

const styles = {
  PreactAudioPlayer__VolumeSlider: {
    backgroundColor: 'red',
    height: 20,
    width: VOLUME_WIDTH,
  },
  PreactAudioPlayer__Play: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    borderRadius: '50%',
  },
};

const PlayIcon = () =>
  <svg width="20" height="20">
    <polygon points="0,0 0,20 20,10" fill="white" />
  </svg>

const PauseIcon = () =>
  <svg width="20" height="20">
    <path d="M0,0 L0,20 L5,20 L5,0 L0,0 M10,0 L10,20 L15,20 L15,0, L10,0" fill="white" />
  </svg>

export default class Widget extends Component {
  state = {
    isMuted: false,
    isPlaying: false,
    volume: 1,
  };

  static defaultProps = {
    url: null
  };

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.audio = document.getElementById('PreactAudioPlayer');
  }

  handlePlayClick = () => {
    this.setState({isPlaying: !this.state.isPlaying});

    if (this.state.isPlaying) {
      this.audio.play();
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
    const {isMuted, isPlaying, volume} = this.state;

    return (
      <div>
        <audio id="PreactAudioPlayer" width="300" height="32" controls="controls">
          <source src={url} type="audio/mp3" />
        </audio>
        <div style={styles.PreactAudioPlayer__Play} onClick={this.handlePlayClick}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </div>
        <div class="PreactAudioPlayer__Volume">
	  {isMuted ? 'Muted' : volume}
          <div class="PreactAudioPlayer__Mute" onClick={this.handleMuteClick}>
            {isMuted ? 'Unmute' : 'Mute'}
          </div>
          <div style={styles.PreactAudioPlayer__VolumeSlider} onMouseMove={this.handleVolumeMouseMove} onMouseDown={this.handleVolumeMouseDown}></div>
        </div>
      </div>
    );
  }
}
