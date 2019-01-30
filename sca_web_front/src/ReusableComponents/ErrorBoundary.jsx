import React, { Component } from 'react';
import ErrorAlert from './ErrorAlert';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log(error);
        console.log(info);
    }

    render() {
        if (this.state.hasError) {       
           return (
            <div className="container">
                <ErrorAlert
                  errorName="Error" 
                  errorMessage="Sorry, something went wrong... Try to go one page back and refresh it in browser"
                   />
            </div>
           )
        }

        return this.props.children;
    }
}

export default ErrorBoundary;