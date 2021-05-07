import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, HeadingText, NrqlQuery, Spinner, AutoSizer } from 'nr1';
import StatusCard from './statuscard';

export default class MultiStatusVisualization extends React.Component {


  constructor(props) {
    super(props);
    this._onStatus = this._onStatus.bind(this);
    this.onGroupClick = this.onGroupClick.bind(this);
   // this.tempdata = ["green","green","green","green"];
    this.state = {
      cardstates: [props.nrqlQueries.length],
    };

  //  for(var i = 0;i < props.nrqlQueries.length; i++)
   // {
   //   this.state.card
   // }


  }
  // Custom props you wish to be configurable in the UI must also be defined in
  // the nr1.json file for the visualization. See docs for more details.
  static propTypes = {

    groupname: PropTypes.string,
    urltarget: PropTypes.string,
    nrqlQueries: PropTypes.arrayOf(
      PropTypes.shape({
        accountId: PropTypes.number,
        query: PropTypes.string,
        label: PropTypes.string,
        warncondition: PropTypes.enum,
        warnthreshold: PropTypes.number,
        alertcondition: PropTypes.enum,
        alertthreshold: PropTypes.number,
      })
    ),
  };

  /**
   * Restructure the data for a non-time-series, facet-based NRQL query into a
   * form accepted by the Recharts library's RadarChart.
   * (https://recharts.org/api/RadarChart).
   */
  transformData = (rawData) => {
    return rawData.map((entry) => ({
      name: entry.metadata.name,
      // Only grabbing the first data value because this is not time-series data.
      value: entry.data[0].y,
    }));
  };

  /**
   * Format the given axis tick's numeric value into a string for display.
   */
  formatTick = (value) => {
    return value.toLocaleString();
  };


  _onStatus(index, status) {
    var items = this.state.cardstates;
    items[index] = status;
   // this.tempdata[index]=status;
    this.setState({ cardstates: items });
  }

  
  onGroupClick()
  {
    if (this.props.urltarget != null && this.props.urltarget.length > 0)
    {
      window.open(this.props.urltarget);
    }
  }

  render() {
    const { nrqlQueries, groupname } = this.props;

    const nrqlQueryPropsAvailable =
      nrqlQueries &&
      nrqlQueries[0] &&
      nrqlQueries[0].accountId &&
      nrqlQueries[0].query;

    if (!nrqlQueryPropsAvailable) {
      return <EmptyState />;
    }

   
    return (
      <AutoSizer>
        {({ width, height }) => {
          const scHeight = (100 / nrqlQueries.length) - 2 + "%";
          var fontsize = (height / nrqlQueries.length) * .30 + "px";
          var titlefont = (height) * .05 + "px";

          var _bordercolor = "white"
          for(var i =0; i < this.state.cardstates.length; i++)
          {
            var state = this.state.cardstates[i];
            if(state == "red")
            {
              _bordercolor = "red";
              break;
            }
          }
    
          return (
            <>
            <div className="container" style={{ borderColor: _bordercolor }} onClick={this.onGroupClick} >

              <div className="group-title" style={{ fontSize: titlefont }}>{groupname}</div>

              <div className="group-body">
                {
                  nrqlQueries.map((d, i) => {
                    if (d.warncondition == null)
                      d.warncondition = ">"

                    if (d.alertcondition == null)
                      d.alertcondition = ">"

                    if (d.warnthreshold == null)
                      d.warnthreshold = '';

                    if (d.alertthreshold == null)
                      d.alertthreshold = '';

                    return (
                      <StatusCard key={i} index={i} element={d} width={"100%"} height={scHeight} fontsize={fontsize} handler={this._onStatus}></StatusCard>
                    );
                  })
                }
              </div>
            </div>
            </>
          )
        }}
      </AutoSizer>
    );
  }
}

const EmptyState = () => (
  <Card className="EmptyState">
    <CardBody className="EmptyState-cardBody">
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        type={HeadingText.TYPE.HEADING_3}
      >
        Please provide at least one NRQL query & account ID pair
      </HeadingText>
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.MEDIUM]}
        type={HeadingText.TYPE.HEADING_4}
      >
        An example NRQL query you can try is:
      </HeadingText>
      <code>SELECT latest(`host.disk.freePercent`) FROM Metric SINCE 30 MINUTES AGO</code>
      <code>SELECT average(`host.cpuPercent`) FROM Metric SINCE 30 MINUTES AGO</code>
    </CardBody>
  </Card>
);

const ErrorState = () => (
  <Card className="ErrorState">
    <CardBody className="ErrorState-cardBody">
      <HeadingText
        className="ErrorState-headingText"
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        type={HeadingText.TYPE.HEADING_3}
      >
        Oops! Something went wrong.
      </HeadingText>
    </CardBody>
  </Card>
);
