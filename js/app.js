// The top-level application component
class MyApplication extends React.Component {
  render() {
    var elapsed = Math.round(this.props.elapsed  / 100);
    var seconds = elapsed / 10 + (elapsed % 10 ? '' : '.0' );
    var message =
      `React has been successfully running for ${seconds} seconds.`;

    return (
      <div>
        <h1>MyApplication</h1>
        <SightReadingPractice />
      </div>
    );
  }
}

/**
 * Component providing the sight reading practice game (in entirety)
 */
class SightReadingPractice extends React.Component {
  render() {
    return <p>Guess this note! Doot doot</p>
  }
}

// Render top-level component to page
ReactDOM.render(
  <MyApplication elapsed={6} />,
  document.getElementById('container')
);
