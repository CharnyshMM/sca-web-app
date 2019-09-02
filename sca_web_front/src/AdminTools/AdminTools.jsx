import React, {Component} from 'react';

import Status from './Status/Status';
import AdminToolsSideMenu from './AdminToolsSideMenu';
import SideMenuPage from '../ReusableComponents/SideMenuPage/SideMenuPage';

class AdminTools extends Component {
  state = {
    selectedTool: 'db_status'
  }

  onSideMenuToolSelected = tool => {
    this.setState({selectedTool: tool});
  }

  render() {
    const {selectedTool} = this.state;
    
    let toolPage = null;
    switch (selectedTool) {
      case 'db_status': 
        toolPage = <Status />;
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