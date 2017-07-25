import { h, Component } from 'preact';

export default class Widget extends Component {
  static defaultProps = {
    url: null
  };
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    let {url} = this.props;
    return (
      <div>
         {url}
      </div>
    );
  }
}
