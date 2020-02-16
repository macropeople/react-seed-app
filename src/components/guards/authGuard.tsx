import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
/*
  validates if component is accessible to user
*/
export function requireAuthentication(Component) {
  class AuthenticatedComponent extends React.Component<any, any> {
    UNSAFE_componentWillMount() {
      this.checkAuth(this.props.isAuthenticated);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps.isAuthenticated);
    }

    checkAuth(isAuthenticated) {
      if (isAuthenticated === false) {
        this.props.history.push("login");
      }
    }

    render() {
      return (
        <div>
          {this.props.isAuthenticated === true ? (
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
