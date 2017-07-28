import React, { Component } from "react";

import { Col, Panel, Button } from "react-bootstrap";
import { FormattedRelative } from "react-intl";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { prettyBytes } from "./utils";
import { zoomToExportRegion } from "../actions/hdx";

function DatasetList(props) {
  const listItems = props.datasets.map((dataset, i) =>
    <li key={i}>
      <a target="_blank" href={dataset.url}>
        <code>
          {dataset.name}
        </code>
      </a>
    </li>
  );

  return (
    <ul>
      {listItems}
    </ul>
  );
}

class ExportRegionPanel extends Component {
  getLastRun() {
    const { region } = this.props;

    if (region.last_run == null) {
      return "Never";
    }

    return <FormattedRelative value={region.last_run} />;
  }

  getNextRun() {
    const { region } = this.props;

    if (region.next_run == null) {
      return "Never";
    }

    return <FormattedRelative value={region.next_run} />;
  }

  getSchedule() {
    const { region } = this.props;

    const scheduleHour = `0${region.schedule_hour}`.slice(-2);

    switch (region.schedule_period) {
      case "6hrs":
        return `Every 6 hours starting at ${scheduleHour}:00 UTC`;

      case "daily":
        return `Every day at ${scheduleHour}:00 UTC`;

      case "weekly":
        return `Every Sunday at ${scheduleHour}:00 UTC`;

      case "monthly":
        return `The 1st of every month at ${scheduleHour}:00 UTC`;

      case "disabled":
        return "Never";

      default:
        return "Unknown";
    }
  }

  selectRegion = () => this.props.zoomToExportRegion(this.props.region.id);

  render() {
    const { region } = this.props;

    return (
      <Panel>
        <h4>
          <Link to={`/hdx/edit/${region.id}`}>
            {region.name || "Untitled"}
          </Link>
          <Link
            className="btn btn-default pull-right"
            to={`/hdx/edit/${region.id}`}
            title="Settings"
          >
            <i className="fa fa-cog" />
          </Link>
          <Button
            title="Show on map"
            className="pull-right"
            onClick={this.selectRegion}
          >
            <i className="fa fa-globe" />
          </Button>
        </h4>
        <Col lg={5}>
          Last Run: <strong>{this.getLastRun(region)}</strong>
          <br />
          Next Run: <strong>{this.getNextRun(region)}</strong>
          <br />
          Schedule: <strong>{this.getSchedule(region)}</strong>
          {region.last_size &&
            <span>
              <br />Size: <strong>{prettyBytes(region.last_size)}</strong>
            </span>}
          {region.is_private &&
            <span>
              <br />
              <strong>Private</strong>
            </span>}
        </Col>
        <Col lg={7}>
          <DatasetList datasets={region.datasets} />
        </Col>
      </Panel>
    );
  }
}

export default connect(null, { zoomToExportRegion })(ExportRegionPanel);