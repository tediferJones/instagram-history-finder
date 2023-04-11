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
    // authorsToRemove: [],
    removeAds: false,
    adNames: [],
    removeFollowing: false,
    followingNames: [],
  });
  const [data, setData] = useState({
    // Merge videoHistory and postHistory, also merge adNames and followingNames, then move the whole thing to the filter state, because that's what it's actually used for
    // And if you do all that just rename this state var to History and make it an array instead of an obj
    // videoHistory: [],
    // postHistory: [],
    // adNames: [],
    // followingNames: [],
    history: [],
  })

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

    setData({
      // adNames,
      // followingNames,
      history,
    })

    setFilters({
      ...filters,
      minDate,
      maxDate,
      startDate: minDate,
      endDate: maxDate,
      adNames,
      followingNames,
      // authorsToRemove: [],
    })
  }

  function getFiles(e) {
    // This function does way too many things, break it up
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

      setInitialState(videoHistory, postHistory, adNames, followingNames);
    }
  }

  function filterChangeHandler(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  function checkboxChange(e) {
    // console.log(typeof(e.target.value));
    // console.log(typeof(JSON.parse(e.target.value)));
    // console.log(e.target.value)
    // console.log(filters.removeFollowing);
    setFilters({
      ...filters,
      [e.target.name]: !JSON.parse(e.target.value),
    })
    // console.log(filters.removeAds)
  }

  function filterDataByTime(item) {
    // first filter by time, then filter out authors from remaining history
    if (item.timeStamp >= new Date(filters.startDate).getTime()
      && item.timeStamp <= new Date(filters.endDate).getTime()) {
      return true;
    }
  }

  function filterDataByAuthor(item) {
    console.log('FILTERING BY AUTHOR')
    // check filter boolean values, create an array of names to check against
    const authorToRemove = [];
    console.log(`adNames: ${filters.adNames}`)
    if (filters.removeAds) { authorToRemove.concat(filters.adNames) }
    if (filters.removeFollowing) { authorToRemove.concat(filters.followingNames) }
    console.log(authorToRemove);

    if (authorToRemove.includes(item.author)) {
      return false;
    } else {
      return true;
    }
  }

  const curratedHistory = (
    // return a filtered version of history
    <h1>CURATED HISTORY</h1>
  )

  return (
    <div>
      {/* BREAK THIS UP INTO A FEW COMPONENTS */}
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
        <label htmlFor='removeAds'>Remove Ad Posts/Videos?</label>
        <input
          id='removeAds'
          name='removeAds' 
          type='checkbox' 
          onChange={checkboxChange} 
          value={filters.removeAds}
        ></input>

        <label htmlFor='removeFollowing'>Remove Following Posts/Videos?</label>
        <input
          id='removeFollowing'
          name='removeFollowing'
          type='checkbox'
          onChange={checkboxChange}
          value={filters.removeFollowing}
        ></input>
      </form>

      <h4>REMOVE ADS: {JSON.stringify(filters.removeAds)}</h4>
      <h4>REMOVE FOLLOWING: {JSON.stringify(filters.removeFollowing)}</h4>

      {/* 
      <h3>VIDEO HISTORY: {data.history.filter(item => item.postType === 'Video').length}</h3>
      <h4>VIDEO HISTORY DATA SAMPLE: {JSON.stringify(data.history.filter(item => item.postType === 'Video')[0])}</h4>
      <h3>POST HISTORY: {data.history.filter(item => item.postType === 'Post').length}</h3>
      <h4>POST HISTORY DATA SAMPLE: {JSON.stringify(data.history.filter(item => item.postType === 'Post')[0])}</h4>
      <h3>AD HISTORY: {data.adNames.length}</h3>
      <h4>AD HISTORY DATA SAMPLE: {JSON.stringify(data.adNames[0])}</h4>
      <h3>FOLLOWING: {data.followingNames.length}</h3>
      <h4>FOLLOWING DATA SAMPLE: {JSON.stringify(data.followingNames[0])}</h4>
      {/* <p>{JSON.stringify(data)}</p> */}

      {curratedHistory}
      <div>
        {data.history.filter(item => filterDataByTime(item))
            .filter(item => filterDataByAuthor(item))
            .map(item => {
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
