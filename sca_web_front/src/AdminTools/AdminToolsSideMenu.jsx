import React from 'react';
import LinkLikeButton from '../ReusableComponents/LinkLikeButton/LinkLikeButton';
import ADMIN_TOOLS_IDS from './adminToolsIDs';
import BulletsFreeList from '../ReusableComponents/BulletsFreeList';

const AdminToolsSideMenu = ({ onToolSelected, selectedTool }) => (
  <div>
    <BulletsFreeList>
      {Object.keys(ADMIN_TOOLS_IDS).map( key => 
        <li>
          <LinkLikeButton onClick={ () => onToolSelected(key) }>
            { ADMIN_TOOLS_IDS[key] }
          </LinkLikeButton>
        </li>
      )}
    </BulletsFreeList>
  </div>
);

export default AdminToolsSideMenu;
export {
  ADMIN_TOOLS_IDS
};