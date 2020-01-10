// import React from 'react';
// import logo from '../logo.svg';
// import './App.css';

// const App: React.FC = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { Component } from 'react';
import Routing from './general/components/comman/route';
import './App.css';

export default class App extends Component {

  public props: any;

  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Routing />
    );
  }
}
