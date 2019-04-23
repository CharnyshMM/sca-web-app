import React, {Component} from 'react';
import AutocompleteInput from '../ReusableComponents/AutocompleteInput/AutocompleteInput';


class Test extends Component {

  // test component to test some new things before adding to working pages
  
  onSubmit = input => {
    console.log(input);
  }

  render() {

    
    return (
      <section>
        <AutocompleteInput
          onSubmit={this.onSubmit}
          suggestions={
            [
              "Computer science",
              "Samsung Galaxy a8",
              "Health",
              "Brexit",
              "Zelensky",
              "Poroshenko",
              "Biology",
              "Psycology",
            ]
          }
        />
        
        
      </section>
    );
  }
};

export default Test;