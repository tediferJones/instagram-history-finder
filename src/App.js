import { useState } from 'react';
import FileSelector from './components/FileSelector.js';
import FilterSelector from './components/FilterSelector.js';
import HistoryMetaData from './components/HistoryMetaData.js';
import CuratedHistory from './components/CuratedHistory.js';
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    // break this up into two objects, timeFilters, and authorFilters
    startDate: '',
    endDate: '',
    minDate: '',
    maxDate: '',
    removeAds: false,
    adNames: [],
    removeFollowing: false,
    followingNames: [],
  });
  const [history, setHistory] = useState([]);

  function setInitialState(videoHistory, postHistory, adNames, followingNames) {
    // Once our files have been extracted and turned into objects, we can set state of history and filters, based on certain values
    const history = [...videoHistory, ...postHistory].sort((a, b) => a.timeStamp - b.timeStamp);

    // Our date string must be re-formatted to ISOString for the calender input values
    const firstDate = new Date(history[0].time);
    const minDate = new Date(firstDate.getTime() - (firstDate.getTimezoneOffset() * 60000))
      .toISOString().slice(0, -8);

    // Our date string must be re-formatted to ISOString for the calender input values
    const lastDate = new Date(history[history.length - 1].time);
    const maxDate = new Date(lastDate.getTime() - (lastDate.getTimezoneOffset() * 60000) + 60000)
      .toISOString().slice(0, -8);

    setHistory(history);

    setFilters({
      ...filters,
      minDate,
      maxDate,
      startDate: minDate,
      endDate: maxDate,
      adNames,
      followingNames,
    })
  }

  function filterChangeHandler(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  function checkboxChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: !JSON.parse(e.target.value),
    })
  }

  return (
    <div>
      <h1>HELLO WORLD</h1>
      <FileSelector setInitialState={setInitialState} />
      <FilterSelector 
        filters={filters}
        filterChangeHandler={filterChangeHandler}
        checkboxChange={checkboxChange}
      />
      <HistoryMetaData
        history={history}
        filters={filters}
      />
      <CuratedHistory 
        history={history}
        filters={filters}
      />
    </div>
  );
}

// TO-DO
//    - Add error handling to FileSelector, see file for more details
//    - Convert filters to two seperate objcts
//    - Simplify setInitialState function
//    - Simplify getFile function in FileSelector if possible
//    - Styling
//

export default App;
