import React from "react";

import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    flexBasis: "33.33%",
    flexShrink: 0,
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.pxToRem(12)
    },
    [theme.breakpoints.up("md")]: {
      fontSize: theme.typography.pxToRem(16)
    }
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.pxToRem(12)
    },
    [theme.breakpoints.up("md")]: {
      fontSize: theme.typography.pxToRem(16)
    }
  },
  expansionText: {
    display: "block",
    color: "white"
  },
  headingTextExpansion: {
    color: "#3f51b5"
  },
  expansionDescription: {
    backgroundColor: "#e8e8e8",
    minHeight: "50px",
    padding: "10px",
    whiteSpace: "pre-wrap",
    fontFamily: "Monaco, Courier, monospace",
    position: "relative",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.pxToRem(12)
    },
    [theme.breakpoints.up("md")]: {
      fontSize: theme.typography.pxToRem(16)
    }
  }
}));

const RequestModal = props => {
  const { programLogs, sasjsConfig, isModalOpen, handleClose, open } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let revealModal = null;
  if (isModalOpen) {
    revealModal = (
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Typography variant="h3">Request History</Typography>
          {`App Location: ${sasjsConfig.programRoot}`}
        </DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            {programLogs.map((programLog, index) => (
              <ExpansionPanel
                key={index}
                expanded={expanded === index + 1}
                onChange={handleChange(index + 1)}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Grid container spacing={3}>
                    <Grid item sm={6} xs={12}>
                      <Typography variant="h5" className={classes.heading}>
                        {programLog.serviceLink.replace(
                          sasjsConfig.programRoot,
                          ""
                        )}
                      </Typography>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <Typography
                        variant="h5"
                        className={classes.secondaryHeading}
                      >
                        {programLog.timestamp.format
                          ? programLog.timestamp.format(
                              "dddd, MMMM Do YYYY, h:mm:ss a"
                            )
                          : programLog.timestamp}
                        {programLog.timestamp.format
                          ? ` (${programLog.timestamp.fromNow()})`
                          : ""}
                      </Typography>
                    </Grid>
                  </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.expansionText}>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`$sas-log-{index}`}
                      id={`$sas-log-{index}`}
                    >
                      <Typography
                        variant="h3"
                        className={classes.headingTextExpansion}
                      >
                        SAS Log
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography
                        variant="h5"
                        className={classes.expansionDescription}
                      >
                        {programLog.logLink}
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`$sas-code-{index}`}
                      id={`$sas-code-{index}`}
                    >
                      <Typography
                        variant="h3"
                        className={classes.headingTextExpansion}
                      >
                        SAS Source Code
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography
                        variant="h5"
                        className={classes.expansionDescription}
                      >
                        {programLog.sourceCode}
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`$sas-code-{index}`}
                      id={`$sas-code-{index}`}
                    >
                      <Typography
                        variant="h3"
                        className={classes.headingTextExpansion}
                      >
                        SAS Generated Code
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography
                        variant="h5"
                        className={classes.expansionDescription}
                      >
                        {programLog.generatedCode}
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return <div className={classes.root}>{revealModal}</div>;
};

export default RequestModal;
