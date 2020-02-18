import React, { useState, useEffect, useRef } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";

import { execSASRequest } from "../redux/actions/sasActions";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const DataPageComponent = props => {
  const { isLoggedIn } = props;
  const prevLoggedIn = usePrevious(isLoggedIn);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [springs, setSprings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRequest, setCurrentRequest] = useState({
    url: "/common/appInit",
    data: null as any
  });

  useEffect(() => {
    let areas = null;
    if (props.startupData.areas) {
      areas = props.startupData.areas;
    } else {
      let res;
      const makeRequest = async () => {
        await execSASRequest("/common/appInit", null).then(r => (res = r));
      };
      makeRequest();
      let jsonResponse;

      try {
        jsonResponse = JSON.parse(res);
        areas = jsonResponse.data.areas;
      } catch (e) {
        console.log("Error parsing json: ", e);
      }
    }

    if (areas) {
      setAreas(areas);
      setSelectedArea(areas[0]["AREA"]);
    }
  }, [props.startupData.areas]);

  useEffect(() => {
    if (
      !prevLoggedIn &&
      props.isLoggedIn &&
      currentRequest &&
      currentRequest.data
    ) {
      executeRequest(currentRequest);
    }
  }, [props.isLoggedIn, prevLoggedIn, currentRequest]);

  const areaOnChange = event => {
    console.log(event.target.value);
    setSelectedArea(event.target.value);
  };

  const submitArea = () => {
    if (props.isLoggedIn) {
      const request = {
        url: "/common/getData",
        data: {
          areas: [{ area: selectedArea }]
        }
      };
      setCurrentRequest(request);
      executeRequest(request);
    }
  };

  const executeRequest = (request: any) => {
    if (request) {
      setIsLoading(true);
      execSASRequest(request.url, request.data).then((res: any) => {
        let jsonResponse;

        try {
          jsonResponse = JSON.parse(res);
          console.log(jsonResponse);
          setSprings(jsonResponse.data.springs);
        } catch (e) {
          console.log("Error parsing json: ", e);
        }
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="home-page">
      <div className="demo-table">
        {areas.length < 1 ? <CircularProgress /> : ""}

        {areas.length > 0 ? (
          <div>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedArea}
              onChange={areaOnChange}
            >
              {areas.map((area: any, index) => {
                return (
                  <MenuItem key={area.AREA + index} value={area.AREA}>
                    {area.AREA}
                  </MenuItem>
                );
              })}
            </Select>

            <Button
              onClick={submitArea}
              style={{ marginLeft: "10px" }}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div>
        ) : (
          ""
        )}

        <hr />

        {isLoading ? <CircularProgress /> : ""}

        {springs && springs.length > 0 && !isLoading ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Latittude</TableCell>
                  <TableCell align="left">Longitude</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Area</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Farenheit</TableCell>
                  <TableCell align="left">Celsius</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {springs.map((row: any, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.LATITUDE}</TableCell>
                    <TableCell align="left">{row.LONGITUDE}</TableCell>
                    <TableCell align="left">{row.NAME}</TableCell>
                    <TableCell align="left">{row.AREA}</TableCell>
                    <TableCell align="left">{row.TYPE}</TableCell>
                    <TableCell align="left">{row.FARENHEIT}</TableCell>
                    <TableCell align="left">{row.CELSIUS}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    startupData: state.sasData.startupData,
    isLoggedIn: state.sasData.userLogged
  };
};

export default connect(mapStateToProps)(DataPageComponent);
