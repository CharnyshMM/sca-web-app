import React from 'react';

const Spinner = () => {
    return(
        <div className="text-center">
            <div className="spinner-border" style={{"width": "5em", "height": "5em", "marginTop": "5%"}} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Spinner;