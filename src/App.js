import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minDate: '',
    maxDate: '',
    authorsToRemove: [],
  });
  const [data, setData] = useState({
    // Merge videoHistory and postHistory, also merge adNames and followingNames, then move the whole thing to the filter state, because that's what it's actually used for
    // And if you do all that just rename this state var to History and make it an array instead of an obj
    // videoHistory: [],
    // postHistory: [],
    adNames: [],
    followingNames: [],
    history: [],
  })

  function getFiles(e) {
    e.preventDefault();
    const file = e.target.fileSelect.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      // unzip the file with JSZip
      const unzippedData = await JSZip.loadAsync(e.target.result)

      // NEEDS ERROR HANDLING for cases like: 'Couldn't find videos_watched.json'

      // then grab the files (i.e. buffers) we want, and convert them to strings, then parse strings into JS objects
      // Also sanitize objects and add extra params if needed
      const videoHistory = JSON.parse(await unzippedData.files['ads_and_topics/videos_watched.json'].async('string'))
        .impressions_history_videos_watched.map(item => {
          return {
            author: item.string_map_data.Author ? item.string_map_data.Author.value : 'DELETED',
            timeStamp: item.string_map_data.Time.timestamp * 1000,
            time: new Date(item.string_map_data.Time.timestamp * 1000).toLocaleString(),
            postType: 'Video',
          }
        });

      const postHistory = JSON.parse(await unzippedData.files['ads_and_topics/posts_viewed.json'].async('string'))
        .impressions_history_posts_seen.map(item => {
          return {
            author: item.string_map_data.Author ? item.string_map_data.Author.value : 'DELETED',
            timeStamp: item.string_map_data.Time.timestamp * 1000,
            time: new Date(item.string_map_data.Time.timestamp * 1000).toLocaleString(),
            postType: 'Post',
          }
        })

      const adNames = JSON.parse(await unzippedData.files['ads_and_topics/ads_viewed.json'].async('string'))
        .impressions_history_ads_seen.map(item => {
          return item.string_map_data.Author ? item.string_map_data.Author.value : 'DELETED';
        })

      const followingNames = JSON.parse(await unzippedData.files['followers_and_following/following.json'].async('string'))
        .relationships_following.map(item => {
          return item.string_list_data[0].value;
        })

      // Once we have our files imported as objects, we can perform some more data sanitization 
      const history = [...videoHistory, ...postHistory].sort((a, b) => a.timeStamp - b.timeStamp);

      const firstDate = new Date(history[0].time);
      const minDate = new Date(firstDate.getTime() - (firstDate.getTimezoneOffset() * 60000))
        .toISOString().slice(0, -8);

      const lastDate = new Date(history[history.length - 1].time);
      const maxDate = new Date(lastDate.getTime() - (lastDate.getTimezoneOffset() * 60000) + 60000)
        .toISOString().slice(0, -8);

      setData({
        adNames,
        followingNames,
        history,
      })

      setFilters({
        minDate,
        maxDate,
        startDate: minDate,
        endDate: maxDate,
        // authorsToRemove: [],
      })
    }
  }

  function filterChangeHandler(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div>
      <h1>HELLO WORLD</h1>
      <form onSubmit={getFiles}>
        <label htmlFor='fileSelect'>SELECT ZIP</label>
        <input type='file' id='fileSelect' name='fileSelect' accept='.zip' />
        <button>UNZIP</button>
      </form>

      <form>
        <label htmlFor='startDate'>FROM DATE</label>
        {/* use min and max on these inputs */}
        <input
          id='startDate'
          name='startDate'
          type='datetime-local'
          onChange={filterChangeHandler}
          value={filters.startDate}
          min={filters.minDate}
          max={filters.maxDate}
        ></input>
        <label htmlFor='endDate'>TO DATE</label>
        <input
          id='endDate'
          name='endDate'
          type='datetime-local'
          onChange={filterChangeHandler}
          value={filters.endDate}
          min={filters.minDate}
          max={filters.maxDate}
        ></input>
        {/* ADD CHECK BOXES FOR remove already following AND remove ad posts */}
      </form>

      <h3>VIDEO HISTORY: {data.history.filter(item => item.postType === 'Video').length}</h3>
      <h4>VIDEO HISTORY DATA SAMPLE: {JSON.stringify(data.history.filter(item => item.postType === 'Video')[0])}</h4>
      <h3>POST HISTORY: {data.history.filter(item => item.postType === 'Post').length}</h3>
      <h4>POST HISTORY DATA SAMPLE: {JSON.stringify(data.history.filter(item => item.postType === 'Post')[0])}</h4>
      <h3>AD HISTORY: {data.adNames.length}</h3>
      <h4>AD HISTORY DATA SAMPLE: {JSON.stringify(data.adNames[0])}</h4>
      <h3>FOLLOWING: {data.followingNames.length}</h3>
      <h4>FOLLOWING DATA SAMPLE: {JSON.stringify(data.followingNames[0])}</h4>
      {/* <p>{JSON.stringify(data)}</p> */}

      <div>
        {data.history.filter(item => {
          // This will re-run on every item, filter state needs to be defined before this happens
          if (item.timeStamp >= new Date(filters.startDate).getTime()
            && item.timeStamp <= new Date(filters.endDate).getTime()) {
            return true;
          } else {
            return false;
          }
        }).map(item => {
          return (
            <div key={uuidv4()}>
              {item.author === 'DELETED' ? <h3>DELETED</h3> : 
                <a href={`https://www.instagram.com/${item.author}`}>
                  <h3>@{item.author}</h3>
                </a>
              }
              <h3>{item.time}</h3>
              <h3>{item.postType}</h3>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
