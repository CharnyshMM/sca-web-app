import React, {Component} from 'react';


class HorizontalKeywordsList extends Component {
    constructor (props) {
        super(props);

    }

    render() {
        
    let listItems = [];
    for (let i = 0; i  < this.props.keywords.length; i++) {
        listItems.push(
            <li className="list-inline-item" key={i}>
                <button type="button" className="btn btn-outline-danger btn-sm" title="Click to remove this keyword" onClick={() => this.props.onClickHandler(i)}>{this.props.keywords[i]}</button>
            </li>
        )
    }

    return (
    <div className="border-bottom">
        <ul className="list-inline">
            {listItems}
        </ul>
    </div>);
    }
};

export default HorizontalKeywordsList;