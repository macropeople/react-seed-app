import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
/*
  validates if component is accessible to user
*/
export function requireNoAuthentication(Component) {
  class AuthenticatedComponent extends React.Component<any, any> {
    UNSAFE_componentWillMount() {
      this.checkNoAuth(this.props.isAuthenticated);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.checkNoAuth(nextProps.isAuthenticated);
    }

    checkNoAuth(isAuthenticated) {
      if (isAuthenticated === true) {
        this.props.history.push("/");
      }
    }

    render() {
      return (
        <div>
          {this.props.isAuthenticated === false ? (
            <Component {...this.props} />
          ) : null}
        </div>
      );
    }
  }

  const mapStateToProps = state => {
    return {
      isAuthenticated: state.sasData.userLogged
    };
  };

  return withRouter(connect(mapStateToProps)(AuthenticatedComponent));
}
