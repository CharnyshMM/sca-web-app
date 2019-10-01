import React, {Component} from 'react';

import { getComponentsIPs } from '../../utilities/verbose_loaders';
import ComponentIPBlock, {ComponentsIpsTableHeader} from './ComponentIPBlock/ComponentIPBlock';
import BulletsFreeList from '../../ReusableComponents/BulletsFreeList';


class ComponentsIPAddresses extends Component {

  state = {
    loading: false,
    hasError: false,
    error: null,
    ips_data: []
  }

  componentDidMount() {
    this.setState({loading: true});

    let status = 0;
    getComponentsIPs()
      .then(
        result => {
          status = result.status;
          return result.resonse.json();
        },
        error => {         
              throw new Error(JSON.stringify(error));
        }
      )
      .then(
        response => {
          if (status != 200) {
            throw new Error(JSON.stringify(response));
          } else {
            this.setState({
              loading: false,
              ips_data: response
            });
          }
        }
      )
      .catch(
        error => this.setState({
            hasError: true,
            error: error,
            errorMessage: error.message
        })
      )
  }

  render() {
    const {loading, hasError} = this.state;
    const ips_data = {
      "addresses": [
        {
          "FILTER_IP": "192.111.222.321"
        },
        {
          "PARSER_IP": "192.111.222.333"
        },
        {
          "GRAPH_IP": "192.111.222.300"
        },
        {
          "STORAGE_IP": "172.20.225.26"
        }
      ]
    };

    return (
      <section>
        <h3>Components IP addresses</h3>
        <ComponentsIpsTableHeader />
        <BulletsFreeList>
          {ips_data["addresses"].map((component,i) => 
            <li key={`component${i}IP`}>
              <ComponentIPBlock component={component} />
            </li>
            )}
        </BulletsFreeList>
      </section>
    );
  }
}

export default ComponentsIPAddresses;