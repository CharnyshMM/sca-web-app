import React from 'react';

// export const n4j = neo4j.driver('bolt://127.0.0.1:7687', neo4j.auth.basic('user', 'user'));

const AutocompleteContext = React.createContext({
  allAuthors: [],
  allThemes: []
});




export default AutocompleteContext;
