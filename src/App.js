import { useState } from 'react';
import FileSelector from './components/FileSelector.js';
import FilterSelector from './components/FilterSelector.js';
import HistoryMetaData from './components/HistoryMetaData.js';
import CuratedHistory from './components/CuratedHistory.js';
import './App.css';

function App() {
  const [history, setHistory] = useState([]);
  const [timeFilters, setTimeFilters] = useState({
    filterStartDate: '',
    filterEndDate: '',
    minDate: '',
    maxDate: '',
  })
  const [authorFilters, setAuthorFilters] = useState({
    removeAds: false,
    adAuthors: [],
    removeFollowing: false,
    followingAuthors: [],
  })

  function getISOString(date, roundUp=false) {
    // default behavior is to round down
    const formattedDate = new Date(date);
    const offset = roundUp ? 60000 : 0;
    return new Date(formattedDate.getTime() - (formattedDate.getTimezoneOffset() * 60000) + offset).toISOString().slice(0, -8);
  }

  function setInitialState(videoHistory, postHistory, adNames, followingNames) {
    // Once our files have been extracted and turned into objects, we can set state of history and filters, based on certain values
    const history = [...videoHistory, ...postHistory].sort((a, b) => a.timeStamp - b.timeStamp);

    // dates must be ISOStrings for use in <input type='datetime-local'/>
    const minDate = getISOString(history[0].time);
    const maxDate = getISOString(history[history.length - 1].time, true);

    console.log(history);

    setHistory(history);
    setTimeFilters({
      minDate,
      maxDate,
      filterStartDate: minDate,
      filterEndDate: maxDate,
    })
    setAuthorFilters({
      ...authorFilters,
      adAuthors: adNames,
      followingAuthors: followingNames,
    })
  }

  function setInitialStateV2(data) {
    // UNDO EVERYTHING RELATED TO THIS
    // It's more confusing, verbose, and actually slower than manually the pulling values from objects
    function addPostType(item, postType) {
      return {
        ...item,
        postType,
      }
    }
    // Add our extra data types
    for (let key of Object.keys(data)) {
      if (key.includes('History')) {
        data[key] = data[key].map(item => {
          return {
            // ...item,
            author: item.value,
            timeStamp: item.timestamp * 1000,
            time: new Date(item.timestamp * 1000).toLocaleString(),
          }
        }) 
      }
    }
    
    const history = [
      ...data.videoHistory.map(item => addPostType(item, 'Video')),
      ...data.postHistory.map(item => addPostType(item, 'Post')),
    ].sort((a, b) => a.timeStamp - b.timeStamp);

    // console.log(data.videoHistory.map(item => addPostType(item, 'Video')));
    // console.log(data);
    console.log(history);

    const minDate = getISOString(history[0].time);
    const maxDate = getISOString(history[history.length - 1].time, true);
    // console.log(minDate)
    // console.log(maxDate)

    setHistory(history);
    setTimeFilters({
      minDate,
      maxDate,
      filterStartDate: minDate,
      filterEndDate: maxDate,
    })
    setAuthorFilters({
      ...authorFilters,
      adAuthors: data.adNames,
      followingAuthors: data.followingNames,
    })
  }

  function timeFiltersHandler(e) {
    setTimeFilters({
      ...timeFilters,
      [e.target.name]: e.target.value,
    })
  }

  function authorFiltersHandler(e) {
    setAuthorFilters({
      ...authorFilters,
      [e.target.name]: !JSON.parse(e.target.value),
    })
  }

  return (
    <div>
      <h1>HELLO WORLD</h1>
      <FileSelector setInitialState={setInitialState}
        setInitialStateV2={setInitialStateV2}
      />
      <FilterSelector 
        timeFilters={timeFilters}
        authorFilters={authorFilters}
        timeFiltersHandler={timeFiltersHandler}
        authorFiltersHandler={authorFiltersHandler}
      />
      <HistoryMetaData
        history={history}
        timeFilters={timeFilters}
        authorFilters={authorFilters}
      />
      <CuratedHistory 
        history={history}
        timeFilters={timeFilters}
        authorFilters={authorFilters}
      />
    </div>
  );
}

// TO-DO
//    - Add error handling to FileSelector, see file for more details
//    - Simplify setInitialState function
//    - Simplify getFile function in FileSelector if possible
//    - Try to make getFile easily expandable, what if we want to add more files in future?
//    - Styling

export default App;
