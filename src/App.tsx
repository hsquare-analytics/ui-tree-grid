import { Route, Routes } from 'react-router-dom';
import TestGrid from './tree-grid/TestGrid';
import './App.css';
import 'devextreme/dist/css/dx.light.css';

function App(): JSX.Element {
  return (
    <>
      <div className="App">
        <TestGrid />
      </div>
    </>
  );
}

export default App;
