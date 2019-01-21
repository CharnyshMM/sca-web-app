import React from 'react';

const ErrorAlert = ({errorName, errorMessage}) => {
    return (
        <div className="alert alert-warning mt-3" role="alert">
            <h4 className="alert-heading">{errorName}</h4>
            <pre><code>{errorMessage}</code></pre>
          </div>
    );
}

export default ErrorAlert;