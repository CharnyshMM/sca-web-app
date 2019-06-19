import React, { Component } from 'react';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
} from 'react-vis';

import "./BeautifulChart.css";


function getChartDataBuilder() {
    let _valuesPerGroup = 1;
    let _valueGroups = [];
    let _data = undefined
    return (valuesPerGroup, data) => {
        if (_valuesPerGroup == valuesPerGroup && _data == data) {
            return _valueGroups
        }
        _valuesPerGroup = valuesPerGroup;
        _data = data;
        const currentColumnsCount = Math.floor(data.length / valuesPerGroup);
        const valuesLeft = (data.length % valuesPerGroup);
        _valueGroups = [];
        
        for(let i = 0; i < data.length - valuesLeft;) {
            let {x, y} = data[i];
            let j = 0;
            for (;j < valuesPerGroup; j++) {
               y = y + data[i+j].y; 
            }
            if (x != data[i+j-1].x) {
                x = `${x}-${data[i+j-1].x}`;
            }
            _valueGroups.push({x:x, y:y});
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
            _valueGroups.push(lastColumn);
        }
        return _valueGroups;
    };
}

const SINGLE_COLUMN_WIDTH = 50;
const MAX_VALUES_PER_COLUMN = 10;


class BeautifulChart extends Component {
    state = {
        valuesPerGroup: 1,
        plusEnabled: false,
        minusEnabled: true,
        hintValue: undefined
    }
    
    mouseX=0
    mouseY=0

    getChartData = getChartDataBuilder()

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

    onMouseMoveHandler = e => {
        this.mouseX = e.clientX+10;
        this.mouseY = e.pageY-30;
        this.mouseEventCounter = 0;
    }
    
    render() {
        const { data } = this.props;
        const { valuesPerGroup, plusEnabled, minusEnabled, hintValue } = this.state;
        
        const chartData = this.getChartData(valuesPerGroup, data);

        const chartWidth = SINGLE_COLUMN_WIDTH*chartData.length;
        return (
            <section >
                {/* <p>valuesPerGroup = {valuesPerGroup}, data.length= {data.length} valuesLeft= {valuesLeft}, length = {valueGroups.length}</p> */}
                <button disabled={!plusEnabled} onClick={this.onPlusClick}>
                    <span className="oi oi-zoom-in"> </span>
                </button>
                <button disabled={!minusEnabled} onClick={this.onMinusClick}>
                    <span className="oi oi-zoom-out"> </span>
                </button>
                
                <div className="beautiful_chart" onMouseMove={this.onMouseMoveHandler}>
                {hintValue && 
                    <span className="beautiful_chart__hint" style={{position: 'absolute', top: this.mouseY, left: this.mouseX}}>
                        {hintValue.y} publications in {hintValue.x}
                    </span>
                }
                    <XYPlot 
                        margin={{ left: 70, bottom: 70 }}
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
                            data={chartData}
                            onValueMouseOut={() => this.setState({hintValue: undefined})}
                            onValueMouseOver={hintValue => this.setState({hintValue})}
                        />
                        
                    </XYPlot>
                </div>
            </section>
        )
    }
}

export default BeautifulChart;