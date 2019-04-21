import React from 'react';

const SimpleNodesLinksList = ({children, linksCreator}) => (
  <ul>
    {Object.values(children).map(
      child => (
        <li key={child["identity"]}>
          <a href={linksCreator(child["identity"])}>{child["name"]}</a>
        </li>
      )
    )}
  </ul>
);

export default SimpleNodesLinksList;

