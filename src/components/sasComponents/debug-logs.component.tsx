import React from "react";

import { getSASProgramLogs } from "../../redux/actions/sasActions";

class DebugLogsComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      programLogs: []
    };
  }

  componentDidMount() {
    let logs = getSASProgramLogs();

    this.setState({ programLogs: logs });
  }

  render() {
    return (
      <div>
        I am Debug logs Component <br />
        <br />
        <strong>Debug logs:</strong>
        {this.state.programLogs.map(log => {
          return <p>{log.logLink}</p>;
        })}
      </div>
    );
  }
}

export default DebugLogsComponent;
