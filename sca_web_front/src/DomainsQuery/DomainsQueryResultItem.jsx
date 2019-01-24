import React from 'react';

import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries
  } from 'react-vis';


import './domains_query_result_item.css';

const DomainsQueryResultItem = ({domainInfo, onAddClick, domainLink}) => {

    const dynamics = [
        {
            x: "< 1950",
            y: domainInfo["dynamics"]["before_1950"]
        },
        {
            x: "1950 - 2000",
            y: domainInfo["dynamics"]["between_1950_and_2000"]
        },
        {
            x: "> 2000",
            y: domainInfo["dynamics"]["after_2000"]
        }
    ];
    return (
        <div className="domains_query_result_item">
            <div className="domains_query_result_item__description">
                <h2><a href={domainLink}>{domainInfo["theme"]["name"]}</a></h2>
                <p><b>{domainInfo["publications_count"]}</b> publications</p>
                <button className="domains_query_result_item__add_button" onClick={onAddClick}>
                    <span className="oi oi-plus"> </span> Add to query
                </button>
            </div>
            <div className="domains_query_result_item__chart">
                <XYPlot margin={{bottom: 70}} xType="ordinal" width={300} height={200}>
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis/>
                            <YAxis title="Works"/>
                            <VerticalBarSeries
                                data={dynamics}
                            />      
                            </XYPlot>  
                <h6>Publications written by time periods</h6>
            </div>

        </div>
    );
}

export default DomainsQueryResultItem;