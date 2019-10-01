import React, {Component} from 'react';

import SideMenuPage from '../ReusableComponents/SideMenuPage/SideMenuPage';
import AdminToolsSideMenu from './AdminToolsSideMenu';
import ComponentsIPAddresses from './ComponentsIPAddresses/ComponentsIPAddresses';
import ProcessesAndThreads from './ProcessesAndThreads/ProcessesAndThreads';
import Status from './Status/Status';
import {DB_STATUS_ID, PROCESSES_ID, COMPONENTS_IPS_ID} from './adminToolsIDs';


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
      case PROCESSES_ID:
        toolPage = <ProcessesAndThreads />
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