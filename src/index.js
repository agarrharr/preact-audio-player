import habitat from 'preact-habitat';
import Widget from './components/widget';

function init() {
  let newWidget = habitat(Widget);
  newWidget.render()
}

// in development, set up HMR:
if (module.hot) {
  require('preact/devtools'); // enables React DevTools, be careful on IE
  module.hot.accept('./components/widget', () => requestAnimationFrame(init));
}

init();
