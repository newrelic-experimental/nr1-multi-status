import React from 'react';
import { Card, CardBody, HeadingText, NrqlQuery, Spinner, AutoSizer, Modal, BlockText, Button, LineChart, ChartGroup } from 'nr1';
import Hexagon from 'react-hexagon'

//  <h3 className="vertical-center">{this.props.cardlabel}</h3>
export default class StatusCard extends React.Component {


    constructor(props) {
        super(props);  
        this.state = {
          color: "green"
        };
      }

    checkProps() {
        let changed = false
        //if (this.props.hasDb !== this.state.hasDb) {
        //    this.setState({ hasDb: this.props.hasDb })
         //   changed = true
        //}
        //if (this.props.name !== this.state.name) {
        //    this.setState({ name: this.props.name })
        //    changed = true
        //}
        //if (changed) {
         //   this.buildQuery()
        //}
    }


    componentWillMount() {
        this.checkProps()
    }
    componentWillReceiveProps() {
        this.checkProps()
    }

    render() {

        let warncondition = this.props.element.warncondition;
        let warnthreshold = this.props.element.warnthreshold;

        let alertcondition = this.props.element.alertcondition;
        let alertthreshold = this.props.element.alertthreshold;



        return (<NrqlQuery
            query={this.props.element.query}
            accountId={this.props.element.accountId}
            pollInterval={NrqlQuery.AUTO_POLL_INTERVAL}
        >
            {({ data, loading, error }) => {
                if (loading) {
                    return <Spinner />;
                }

                if (error) {
                    return <div className="header" style={{ fontSize: this.props.fontsize }}>Error</div>;
                }


                const groupName = data[0].metadata.groups[data[0].metadata.groups.length - 1].name;
                const groupValue = data[0].metadata.groups[data[0].metadata.groups.length - 1].value;


                const resultval = data[0].data[0][groupValue];

                var statuscolor = "green"




                // check warning status
                if (warncondition.includes(">") && warnthreshold.length > 0 && !isNaN(warnthreshold)) {
                    if (resultval > warnthreshold)
                        statuscolor = "orange";
                }
                else if (warncondition.includes("<") && warnthreshold.length > 0 && !isNaN(warnthreshold)) {
                    if (resultval < warnthreshold)
                        statuscolor = "orange";
                }

                // check Alert Status 
                if (alertcondition.includes(">") && alertthreshold.length > 0 && !isNaN(alertthreshold)) {
                    if (resultval > alertthreshold)
                        statuscolor = "red";
                }
                else if (alertcondition.includes("<") && alertthreshold.length > 0 && !isNaN(alertthreshold)) {
                    if (resultval < alertthreshold)
                        statuscolor = "red";
                }

                // only notify if it has changed???, 
                let currcolor =this.state.color;
                if(currcolor != statuscolor)
                {
                    this.props.handler(this.props.index, statuscolor);
                    this.setState({ color: statuscolor });
                }

                return (
                    <div className="Status-Holder" style={{ width: this.props.width, height: this.props.height }}>

                        <div className="Status-Card" >
                            <div className="Status-Icon">
                                <Hexagon
                                    className="Status-Icon-wrap"
                                    style={{ stroke: '#000000', fill: statuscolor }}
                                />
                            </div>
                            <div className="Status-Label">

                                <div className="header" style={{ fontSize: this.props.fontsize }}>{this.props.element.label}</div>
                            </div>
                        </div>
                    </div>
                );
            }}
        </NrqlQuery>);
    }
}
