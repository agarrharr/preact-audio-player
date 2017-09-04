import { h, Component } from 'preact';

const VOLUME_WIDTH = 20;

const styles = {
  PreactAudioPlayer__VolumeSlider: {
    backgroundColor: 'red',
    height: 20,
    width: VOLUME_WIDTH,
  },
};

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
  }

  handlePlayClick = () => {
    this.setState({isPlaying: !this.state.isPlaying});
    const activeSong = document.getElementById('song');

    if (this.state.isPlaying) {
      activeSong.play();
    } else {
      activeSong.pause();
    }
  };

  handleVolumeChange = (volume) => {
    this.setState({volume});
    const activeSong = document.getElementById('song');
    activeSong.volume = volume;
  };

  handleMuteClick = () => {
    this.setState({
      isMuted: !this.state.isMuted,
      volume: this.state.volume === 0 ? 0.5 : this.state.volume,
    });
    const activeSong = document.getElementById('song');
    activeSong.volume = this.state.isMuted ? 0 : this.state.volume;
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
      const activeSong = document.getElementById('song');
      activeSong.volume = this.state.volume;
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
<p>hello</p>
        <audio id="song" width="300" height="32" controls="controls">
          <source src={url} type="audio/mp3" />
        </audio>
        {url}
        <div class="PreactAudioPlayer__Play" onClick={this.handlePlayClick}>
	  {isPlaying ? 'Pause' : 'Play'}
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
