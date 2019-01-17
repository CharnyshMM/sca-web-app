import React, { Component } from 'react';

class CustomQueryTextResponse extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        function parseResultItem(item) {
            let viewContent = "";
            console.log(item);
            if (item instanceof (Object)) {
                viewContent = (<ul style={{ maxWidth: '70%' }}>
                    {Object.keys(item).map((key, i) =>
                        <li>
                            <b>{key}:</b> {parseResultItem(item[key])}
                        </li>
                    )}
                </ul>);
            } else {
                return item.toString()
            }
            return viewContent;
        };

        return (
            <div>
                {this.props.result && (
                    <ul className="list-group mt-3">
                        {(this.props.result).map((record, i) => (
                            <li className="list-group-item" key={i}>
                                <table className="table table-sm">
                                    <tbody>
                                        {Object.keys(record).map((key, j) => (
                                            <tr key={j}><th scope="row">{key}</th><td style={{ maxWidth: '70%' }}>{parseResultItem(record[key])}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </li>
                        ))}
                    </ul>
                )
                }
            </div>

        );
    }
}

export default CustomQueryTextResponse;