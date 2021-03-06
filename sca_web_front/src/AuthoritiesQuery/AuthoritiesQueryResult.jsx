import React, { Component } from 'react';

import ErrorAlert from '../ReusableComponents/ErrorAlert';
import BeautifulSelect from '../ReusableComponents/BeautifulSelect/BeautifulSelect';

class AuthoritiesQueryResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: "publications",
        };

        this.onTableRowClick = this.onTableRowClick.bind(this);
        this.onSortBySelectionChanged = this.onSortBySelectionChanged.bind(this);
    }

    onTableRowClick(index) {
        if (!this.props.result) {
            return;
        }
        const author = this.props.result[index];
        this.props.onItemClick(author);
    }

    onSortBySelectionChanged(event) {
        this.setState({sortBy: event.target.value});
    }

    render() {
        const { result, mayBeMore, onMoreClick, loading } = this.props;
        const { sortBy } = this.state;

        const sortedMappedResult = result
            .sort((a, b) => {
                if (sortBy == "publications") {
                    return b["publications_count"] - a["publications_count"];
                } else {
                    return b["links_count"] - a["links_count"]
                }
            })
            .map((row, i) => (
                <tr key={i} onClick={() => this.onTableRowClick(i)}>
                    <th scope="row">
                        {i}
                    </th>
                    <td>
                        {row['author']['name']}
                    </td>
                    <td>
                        {row['publications_count']}
                    </td>
                    <td>
                        {row['links_count']}
                    </td>
                </tr>
            ));

        const optionsValueLabelDict = {
            publications: "Publications count",
            links: "References count",
        };

        return (
            <section className="authorities_query__result">
                <div>
                    <BeautifulSelect 
                        label="Sort by "
                        optionsValuesLabelsDict={optionsValueLabelDict} 
                        onSelectionChanged={this.onSortBySelectionChanged}
                        />
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Author</th>
                            <th scope="col">Publications count</th>
                            <th scope="col">References Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMappedResult}
                    </tbody>
                </table>
                {mayBeMore && !loading &&
                    <button 
                        className="authorities_query__result__more_button"
                        onClick={onMoreClick}>
                            More
                    </button>
                }
            </section>
        );
    }
}

export default AuthoritiesQueryResult;