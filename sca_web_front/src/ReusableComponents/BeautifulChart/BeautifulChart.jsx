import React, { Component } from 'react';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries
} from 'react-vis';

import "./BeautifulChart.css";

const SINGLE_COLUMN_WIDTH = 50;
const MIN_COLUMNS_COUNT = 3;

class BeautifulChart extends Component {
    state = {
        currentColumnsCount: 10,
        plusEnabled: true,
        minusEnabled: true
    };

    onPlusClick = () => {
        const {currentColumnsCount} = this.state;
        const maximum = this.props.data.length;
        if (currentColumnsCount + 1 >= maximum) {
            this.setState({currentColumnsCount: maximum, plusEnabled: false, minusEnabled: true});
            return;
        } else {
            this.setState({ currentColumnsCount: currentColumnsCount+1, minusEnabled: true });
        }
    }

    onMinusClick = () => {
        const {currentColumnsCount} = this.state;
        const length = this.props.data.length;
        if (currentColumnsCount - 1 <= length && currentColumnsCount-1 <= MIN_COLUMNS_COUNT) {
            this.setState({currentColumnsCount: MIN_COLUMNS_COUNT, minusEnabled: false, plusEnabled: true});
            return;
        } else {
            this.setState({ currentColumnsCount: currentColumnsCount-1, plusEnabled: true });
        }
    }

    render() {
        const { data } = this.props;
        const { currentColumnsCount, plusEnabled, minusEnabled } = this.state;
        console.log("currentColumnsCount",currentColumnsCount);
        const valuesPerGroup = Math.floor(data.length / currentColumnsCount);
        console.log("valuesPerGroup",valuesPerGroup)
        const valuesLeft = (data.length % currentColumnsCount);
        console.log("valuesLeft",valuesLeft);
        const valueGroups = [];
        
        for(let i = 0; i < data.length - valuesLeft;) {
            let {x, y} = data[i];
            let j = 0;
            for (;j < valuesPerGroup; j++) {
               y = y + data[i+j].y; 
            }
            x = `${x}-${data[i+j-1].x}`;
            
            valueGroups.push({x:x, y:y});
            i = i + valuesPerGroup;
        }

        if (valuesLeft > 0) {
            const lastColumn = {
                x: `${data[data.length - valuesLeft].x}-${data[data.length-1].x}`,
                y: 0
            };
            for (let i = data.length - valuesLeft; i < data.length; i++) {
                lastColumn.y += data[i].y;
            }
            valueGroups.push(lastColumn);
        }

        const chartWidth = SINGLE_COLUMN_WIDTH*valueGroups.length;
        return (
            <section className="beautiful_chart">
                <button disabled={!plusEnabled} onClick={this.onPlusClick}>
                    <span className="oi oi-zoom-in"> </span>
                </button>
                <button disabled={!minusEnabled} onClick={this.onMinusClick}>
                    <span className="oi oi-zoom-out"> </span>
                </button>
                <XYPlot 
                    margin={{ bottom: 70 }}
                     xType="ordinal" 
                     width={chartWidth} 
                     height={200} 
                     >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <YAxis />
                    <XAxis tickLabelAngle={-45}/>
                    <VerticalBarSeries
                        barWidth={0.4}
                        data={valueGroups}
                    />
                </XYPlot>
            </section>
        )
    }
}

export default BeautifulChart;