import React from "react";
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

import cachedData from '../cached_data';

import { execSASRequest, getSasjsConfig } from "../redux/actions/sasActions";

class DataPageComponent extends React.Component<any, any> {
    state: any;
    constructor(props) {
        super(props);
        this.state = {
            areas: [],
            selectedArea: "",
            springs: [],
            loadingSprings: false,
            sasjsConfig: {}
        };
    }
    async componentDidMount() {
        let areas = null;

        if (cachedData.areas) {
            areas = cachedData.areas;
        } else {
            let res: any = await execSASRequest("/common/appInit", null);

            let jsonResponse;

            try {
                jsonResponse = JSON.parse(res);
                areas = jsonResponse.data.areas;
            } catch (e) {
                console.log("Error parsing json: ", e);
            }
        }

        if (areas) {
            this.setState({
                areas: areas,
                selectedArea: areas[0]['AREA']
            });
        }

        this.setState({ sasjsConfig: getSasjsConfig() });
    }

    areaOnChange = event => {
        console.log(event.target.value);
        this.setState({ selectedArea: event.target.value });
    };

    submitArea = () => {
        this.setState({ loadingSprings: true });

        execSASRequest("/common/getData", {
            areas: [{ area: this.state.selectedArea }],
        }).then((res: any) => {
            let jsonResponse;

            try {
                jsonResponse = JSON.parse(res);
                console.log(jsonResponse);
                this.setState({ springs: jsonResponse.data.springs });
            } catch (e) {
                console.log("Error parsing json: ", e);
            }

            this.setState({ loadingSprings: false });
        });
    };

    render() {
        return (
            <div className="home-page">
                <div className="demo-table">
                    {this.state.areas.length < 1 ? <CircularProgress /> : ""}

                    {this.state.areas.length > 0 ? (
                        <div>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.selectedArea}
                                onChange={this.areaOnChange}
                            >
                                {this.state.areas.map((area, index) => {
                                    return (
                                        <MenuItem key={area.AREA + index} value={area.AREA}>
                                            {area.AREA}
                                        </MenuItem>
                                    );
                                })}
                            </Select>

                            <Button
                                onClick={this.submitArea}
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

                    {this.state.loadingSprings ? <CircularProgress /> : ""}

                    {this.state.springs.length > 0 && !this.state.loadingSprings ? (
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
                                    {this.state.springs.map((row, index) => (
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
    }
}

export default DataPageComponent;
