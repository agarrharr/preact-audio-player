import { h, Component } from 'preact';

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
    console.log(this.props);
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
    this.setState({isMuted: !this.state.isMuted});
    const activeSong = document.getElementById('song');
    activeSong.volume = this.state.isMuted ? 0 : this.state.volume;
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
          <div class="PreactAudioPlayer__Mute" onClick={this.handleMuteClick}>Mute</div>
        </div>
      </div>
    );
  }
}
