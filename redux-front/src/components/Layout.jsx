import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from './Spinner';

class Layout extends Component {
    render() {
        const { authorized, loading } = this.props;
        let content = null;
        if (authorized && !loading) {
            //show the content
        } else if (!loading) {
            //show login form
        } else {
            content = ( <Spinner /> );
        }
        return(
            <div>
                {content}
            </div>
        )
    }
}

Layout.propTypes = {
    authorized: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default Layout;