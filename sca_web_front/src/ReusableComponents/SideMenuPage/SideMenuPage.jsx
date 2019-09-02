import React from 'react';

import './SideMenuPage.css';

const SideMenuPage = ({sideMenu, children}) => (
  <section className="side_menu_page">
    <div className="side_menu_page__side_menu">
      {sideMenu}
    </div>
    <div className="side_menu_page__page">
      {children}
    </div>
  </section>
);

export default SideMenuPage;