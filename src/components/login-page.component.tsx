import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import { loadStartUp } from "../redux/actions/sasActions";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(15),
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  wrapper: {
    margin: theme.spacing(1)
  },
  buttonProgress: {
    top: "50%",
    left: "50%"
  }
});

interface MyState {
  username: any;
  password: any;
  loading: boolean;
}

class LoginPageComponent extends React.Component<any, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false
    };
  }
  signIn = () => {
    const self = this;
    self.setState({ loading: true });
    let jqXhr = this.props.sasService.SASlogin(
      this.state.username,
      this.state.password
    );
    jqXhr
      .then(
        function (res) {
          console.log(res);

          if (res.search(/success/gmi)) {
            let payload = { service: self.props.sasService, data: res };
            self.props.loadStartUp(payload);
            self.props.history.push("/");
          } else {
            if (res.search(/error/gmi)) {
              self.setState({ loading: false });
            }
          }
        },
        function (err) {
          console.log(err);
          self.setState({ loading: false });
        }
      )
      .catch(e => {
        if (e === 403) {
          console.log("Invalid HOST");
        }
        self.setState({ loading: false });
      });
  };

  handleChange = e => {
    let target = e.target.name;
    let stateObj = {};
    stateObj[target] = e.target.value;
    this.setState(stateObj);
  };

  render() {
    const classes = (this.props as any).classes;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper + " col-flex"}>
          <div>
            <img
              className="base-logo"
              alt="company logo"
              width="60px"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
            />
          </div>
          <Typography
            component="h1"
            variant="h5"
            style={{ textAlign: "center" }}
          >
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={this.state.username}
              onChange={this.handleChange}
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={this.state.password}
              onChange={this.handleChange}
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              disabled={this.state.loading}
              onClick={this.signIn}
              className={classes.submit}
            >
              {this.state.loading ? (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              ) : (
                  "Sign In"
                )}
            </Button>
          </form>
        </div>
        <Box mt={8}></Box>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { sasService: state.sasData.service };
};

const mapDispatchToProps = dispatch => ({
  loadStartUp: payload => dispatch(loadStartUp(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LoginPageComponent));
