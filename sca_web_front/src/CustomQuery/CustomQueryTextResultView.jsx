import React, { Component } from 'react';
import ObjectTextView from '../ReusableComponents/ObjectTextView';

class CustomQueryTextResultView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.result && (
                    <ul className="list-group">
                        {(this.props.result).map((record, i) => (
                            <li className="list-group-item" key={i}>
                                <table className="table table-sm">
                                    <tbody>
                                        {Object.keys(record).map((key, j) => (
                                            <tr key={j}>
                                                <th scope="row">{key}</th>
                                                <td style={{ maxWidth: '70%' }}>
                                                    <ObjectTextView object={record[key]} />
                                                </td>
                                            </tr>
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

export default CustomQueryTextResultView;