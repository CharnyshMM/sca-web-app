import React from 'react';


const CustomQueryConstructorClause = ({ index, clauseType, clauseValue, onChangeClauseType, onChangeClauseValue, onRemoveClause }) => (
    <div className="row">
        <div className="d-flex align-items-center">[{index}]:</div>
        <div className="col">
            <div className="input-group">
                <select className="form-control" value={clauseType} onChange={onChangeClauseType}>
                    <option value="match">MATCH</option>
                    <option value="return">RETURN</option>
                    <option value="where">WHERE</option>
                    <option value="limit">LIMIT</option>
                    <option value="orderby">ORDER BY</option>
                </select>
            </div>
            <div className="input-group">
                <input type="text" value={clauseValue} onChange={onChangeClauseValue} className="form-control" />
            </div>
        </div>
        <button type="button" className="close" onClick={onRemoveClause}>
            <span className="oi oi-x"> </span>
        </button>
    </div>
);

export default CustomQueryConstructorClause;