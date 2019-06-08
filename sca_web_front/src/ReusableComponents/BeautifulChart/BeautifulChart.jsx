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
const MAX_VALUES_PER_COLUMN = 10;

class BeautifulChart extends Component {
    state = {
        valuesPerGroup: 1,
        plusEnabled: false,
        minusEnabled: true
    };

    onMinusClick = () => {
        const {valuesPerGroup} = this.state;
        const length = this.props.data.length;
        const columnsCount = Math.floor(length / (valuesPerGroup + 1));
        if (columnsCount + (length % (valuesPerGroup + 1)) > 3) {
            this.setState({
                valuesPerGroup: valuesPerGroup + 1, 
                plusEnabled: true
            });
        } else {
            this.setState({
                plusEnabled: true,
                minusEnabled: false
            });
        }
        
    }

    onPlusClick = () => {
        const {valuesPerGroup} = this.state;
        if (valuesPerGroup -1 > 1) {
            this.setState({
                valuesPerGroup: valuesPerGroup - 1,
                minusEnabled: true
            });
        } else {
            this.setState({
                valuesPerGroup: 1,
                minusEnabled: true,
                plusEnabled: false 
            }); 
        }
    }

    render() {
        const { data } = this.props;
        const { valuesPerGroup, plusEnabled, minusEnabled } = this.state;
        const currentColumnsCount = Math.floor(data.length / valuesPerGroup);
        console.log("valuesPerGroup",valuesPerGroup);
        console.log("currentColumnsCount",currentColumnsCount);

        const valuesLeft = (data.length % valuesPerGroup);
        console.log("valuesLeft",valuesLeft);
        const valueGroups = [];
        
        for(let i = 0; i < data.length - valuesLeft;) {
            let {x, y} = data[i];
            let j = 0;
            for (;j < valuesPerGroup; j++) {
               y = y + data[i+j].y; 
            }
            if (x != data[i+j-1].x) {
                x = `${x}-${data[i+j-1].x}`;
            }
            valueGroups.push({x:x, y:y});
            i = i + valuesPerGroup;
        }

        if (valuesLeft > 0) {
            const startX = data[data.length - valuesLeft].x;
            const endX = data[data.length-1].x;
            const lastColumn = {
                x: startX == endX ? startX : `${startX}-${endX}`,
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
                {/* <p>valuesPerGroup = {valuesPerGroup}, data.length= {data.length} valuesLeft= {valuesLeft}, length = {valueGroups.length}</p> */}
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