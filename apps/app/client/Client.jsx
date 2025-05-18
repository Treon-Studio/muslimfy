import '../src/App.css';
import '@lynx-js/web-core/index.css';
import '@lynx-js/web-elements/index.css';
import '@lynx-js/web-core';
import '@lynx-js/web-elements/all';

const Client = () => {
  return (
    <lynx-view
      style={{ height: '100vh', width: '100vw' }}
      url="/main.web.bundle"
    />
  );
};

export default Client;
