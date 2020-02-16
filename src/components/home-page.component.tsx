import React from "react";

class HomePageComponent extends React.Component<any, any> {

  render() {
    return (
      <div className="home-page">
        <div className="navbar">
          <img src="/logo.png" alt="logo" />

          <div onClick={() => { this.props.history.push('/') }} className="button">Demo</div>
        </div>
        <h1>Homepage</h1>
      </div>
    );
  }
}

export default HomePageComponent;
