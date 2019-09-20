import React, {Component} from 'react';

import Status from './Status/Status';
import AdminToolsSideMenu from './AdminToolsSideMenu';
import SideMenuPage from '../ReusableComponents/SideMenuPage/SideMenuPage';
import {DB_STATUS_ID, BUS_THREADS_ID, COMPONENTS_IPS_ID} from './adminToolsIDs';
import ComponentsIPAddresses from './ComponentsIPAddresses/ComponentsIPAddresses';

class AdminTools extends Component {
  state = {
    selectedTool: DB_STATUS_ID
  }

  onSideMenuToolSelected = tool => {
    this.setState({selectedTool: tool});
  }

  render() {
    const {selectedTool} = this.state;
    
    let toolPage = null;
    switch (selectedTool) {
      case DB_STATUS_ID: 
        toolPage = <Status />;
        break;
      case COMPONENTS_IPS_ID:
        toolPage = <ComponentsIPAddresses />
        break;
    }
    return (
      <SideMenuPage 
        sideMenu={
          <AdminToolsSideMenu onToolSelected={this.onSideMenuToolSelected} selectedTool={selectedTool} />
        }
      >
        {toolPage}
      </SideMenuPage>
    )
  }
}

export default AdminTools;