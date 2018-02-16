import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {},
            currentSelectedItem: this.props.items[0].name
        }
        Chart.defaultProps = {
            displayTitle: true,
            displayLegend: true,
            legendPosition: 'right',
            location: 'City'
        };
        this.onChangeItem = this.onChangeItem.bind(this);
    }
    componentDidMount() {
        this.getChartData(this.props.items[0].itemID);
    }

    getChartData(itemID) {
        this.props.getChartData(itemID).then((res) => {
            this.setState({
                chartData: {
                    labels: res.data.chartData.map((element, i) => {
                        return moment(element.transactionDate).utc().local().format("MM/DD/YYYY h:mm:ss");
                    }),
                    datasets: [
                        {
                            label: 'Qty',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 1.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 5,
                            pointHitRadius: 50,
                            data: res.data.chartData.map((element, i) => {
                                return element.qty;
                            })
                        }
                    ]
                }
            });
        })
    }

    onChangeItem(e) {
        this.getChartData(this.props.items[e.target.value].itemID);
        this.setState({ currentSelectedItem: this.props.items[e.target.value].name })
    }

    render() {
        const items = this.props.items.map((item, i) => {
            return <option key={i} value={i}>{item.name}</option>;
        });
        return (
            <div className="row" style={{ marginTop: "50px" }}>
                <select onChange={this.onChangeItem}>
                    {items}
                </select>
                <div>
                    <center><h1>Graph of {this.state.currentSelectedItem}</h1></center>
                    <Line
                        data={this.state.chartData}
                        width={100}
                        height={300}
                        options={{ maintainAspectRatio: false }}
                    />
                </div>
            </div >
        )
    }
}

export default Chart;