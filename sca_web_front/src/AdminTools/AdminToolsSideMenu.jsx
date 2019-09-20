import React from 'react';
import LinkLikeButton from '../ReusableComponents/LinkLikeButton/LinkLikeButton';
import { ADMIN_TOOLS_NAMES } from './adminToolsIDs';
import BulletsFreeList from '../ReusableComponents/BulletsFreeList';

const AdminToolsSideMenu = ({ onToolSelected, selectedTool }) => (
  <div>
    <BulletsFreeList>
      {Object.keys(ADMIN_TOOLS_NAMES).map( key => 
        <li>
          <LinkLikeButton onClick={ () => onToolSelected(key) }>
            { ADMIN_TOOLS_NAMES[key] }
          </LinkLikeButton>
        </li>
      )}
    </BulletsFreeList>
  </div>
);

export default AdminToolsSideMenu;
