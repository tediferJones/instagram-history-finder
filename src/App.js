import { useState } from 'react';
import FileSelector from './components/FileSelector.js';
import FilterSelector from './components/FilterSelector.js';
import HistoryMetaData from './components/HistoryMetaData.js';
import CuratedHistory from './components/CuratedHistory.js';
import Guide from './components/Guide.js';

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
    removeDeleted: false,
    deletedAuthors: ['DELETED'],
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

    const sanitizedAdNames = [...new Set(adNames)]
    sanitizedAdNames.splice(sanitizedAdNames.indexOf('DELETED'), 1)

    setHistory(history);
    setTimeFilters({
      minDate,
      maxDate,
      filterStartDate: minDate,
      filterEndDate: maxDate,
    })
    setAuthorFilters({
      ...authorFilters,
      adAuthors: sanitizedAdNames,
      followingAuthors: followingNames,
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
      <div className='flex justify-between'>
        <h1 className='text-3xl font-bold underline m-6'>Instagram History Finder</h1>
        <a className='text-2xl p-4 m-2 underline duration-700 hover:bg-gray-600 hover:text-white'
          href='https://github.com/tediferJones/instagram-history-finder'
        >GitHub</a>
      </div>
      <Guide />
      <FileSelector setInitialState={setInitialState} />
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
//      - If one our desired files cannot be found, just use an empty array
//    - Styling: Tailwind Cheat Sheet: https://nerdcave.com/tailwind-cheat-sheet
//    - Add filters to show only videos or only posts

export default App;
