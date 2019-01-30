import React from 'react';

import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    DecorativeAxis
} from 'react-vis';


import './domains_query_result_item.css';

const DomainsQueryResultItem = ({ domainInfo, onAddClick, domainLink, maxPublicationsInPeriodsTick}) => {

    const dynamics = [
        {
            x: "<1950",
            y: domainInfo["dynamics"]["before_1950"]
        },
        {
            x: "1950-1970",
            y: domainInfo["dynamics"]["between_1950_and_1970"]
        },
        {
            x: "1970-1990",
            y: domainInfo["dynamics"]["between_1970_and_1990"]
        },
        {
            x: "1990-2010",
            y: domainInfo["dynamics"]["between_1990_and_2010"]
        },
        {
            x: ">2010",
            y: domainInfo["dynamics"]["after_2010"]
        }
    ];

    
    return (
        <div className="domains_query_result_item">
            <div className="domains_query_result_item__description">
                <h2><a href={domainLink}>{domainInfo["theme"]["name"]}</a></h2>
                <p><b>{domainInfo["publications_count"]}</b> publications</p>
                <p><b></b></p>
                <button className="domains_query_result_item__add_button" onClick={onAddClick}>
                    <span className="oi oi-plus"> </span> Add to query
                </button>
            </div>
            <div className="domains_query_result_item__chart">
                <XYPlot 
                    margin={{ bottom: 70 }}
                     xType="ordinal" 
                     width={300} 
                     height={200} 
                     yDomain={[0, maxPublicationsInPeriodsTick]}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <YAxis />
                    <XAxis tickLabelAngle={-45}/>
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