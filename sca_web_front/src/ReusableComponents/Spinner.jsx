import React from 'react';

const Spinner = () => {
    return(
        <div class="text-center">
            <div class="spinner-border" style={{"width": "5em", "height": "5em", "marginTop": "5%"}} role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Spinner;