import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    authorsToRemove: [],
  });
  const [data, setData] = useState({
    // Merge videoHistory and postHistory, also merge adNames and followingNames, then move the whole thing to the filter state, because that's what it's actually used for
    // And if you do all that just rename this state var to History and make it an array instead of an obj
    videoHistory: [],
    postHistory: [],
    adNames: [],
    followingNames: [],
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
            timeStamp: item.string_map_data.Time.timestamp,
            time: new Date(item.string_map_data.Time.timestamp * 1000).toLocaleString(),
            postType: 'Video',
          }
        });

      const postHistory = JSON.parse(await unzippedData.files['ads_and_topics/posts_viewed.json'].async('string'))
        .impressions_history_posts_seen.map(item => {
          return {
            author: item.string_map_data.Author ? item.string_map_data.Author.value : 'DELETED',
            timeStamp: item.string_map_data.Time.timestamp,
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

      // then convert these JSON strings to JS objects, and update state var
      setData({
        videoHistory,
        postHistory,
        adNames,
        followingNames,
      })
      // CONSIDER MERGING videoHistory AND postHistory AND THEN SORTING THEM UP HERE
      // ALSO CONSIDER setting filter state here,
      // This will allow you to set default dates for the calender inputs
      // Then handle changes to the form via our filterHandler
    }
  }

  function filterHandler(e) {
    // set State for filter vars
    console.log(e.target)
    // GET DEFAULT STATE WORKING, THEN WORRY ABOUT HANDLING CHANGES
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
        <label htmlFor='fromDate'>FROM DATE</label>
        {/* use min and max on these inputs */}
        <input id='fromDate' name='fromDate' type='datetime-local' onChange={filterHandler}></input>
        <label htmlFor='toDate'>TO DATE</label>
        <input id='toDate' from='toDate' type='datetime-local'  onChange={filterHandler}></input>
      </form>

      <h3>VIDEO HISTORY: {data.videoHistory.length}</h3>
      <h4>VIDEO HISTORY DATA SAMPLE: {JSON.stringify(data.videoHistory[0])}</h4>
      <h3>POST HISTORY: {data.postHistory.length}</h3>
      <h4>POST HISTORY DATA SAMPLE: {JSON.stringify(data.postHistory[0])}</h4>
      <h3>AD HISTORY: {data.adNames.length}</h3>
      <h4>AD HISTORY DATA SAMPLE: {JSON.stringify(data.adNames[0])}</h4>
      <h3>FOLLOWING: {data.followingNames.length}</h3>
      <h4>FOLLOWING DATA SAMPLE: {JSON.stringify(data.followingNames[0])}</h4>
      {/* <p>{JSON.stringify(data)}</p> */}

      {/* Add a seperate form somewhere up here, this will control our filter parameters */}

      <div>
        {[...data.videoHistory, ...data.postHistory]
            .sort((a, b) => a.timeStamp - b.timeStamp)
            .filter(item => {
              // This will re-run on every item, filter state needs to be defined before this happens
              return true;
            })
            .map(item => {
              return (
                <div key={uuidv4()}>
                  {/* {JSON.stringify(item)} */}
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
