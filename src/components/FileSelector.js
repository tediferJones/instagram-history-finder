import JSZip from 'jszip';

function FileSelector(props) {
  // function drillFor(item, desiredKey) {
  //   // This will become a recursive function
  //   // This function should only return one value
  //   //
  //   // THIS FUNCTION ONLY CHECKS THE FIRST KEY
  //   //
  //   const keys = Object.keys(item);
  //   console.log(keys);
  //   if (keys.includes(desiredKey)) {
  //     return item[desiredKey];
  //   }
  //   for (let i = 0; i < keys.length; i++) {
  //     console.log(keys[i])
  //     // if (keys[i] === desiredKey) {
  //     //   return item[keys[i]]
  //     // }
  //     if (Array.isArray(item[keys[i]])) {
  //       return drillFor(item[keys[i]][0], desiredKey)
  //     }
  //     if (typeof(item[keys[i]]) === 'object') {
  //       return drillFor(item[keys[i]], desiredKey);
  //     }
  //   }
  //   return 'DELETED'
  //   // Object.keys(item).map(key => {
  //   //   console.log(key);
  //   //   if (key === desiredKey) {
  //   //     console.log('FOUND A KEY')
  //   //     return item[key];
  //   //   } else {
  //   //     // if (Array.isArray(item[key]) && item[key].length === 1) {
  //   //     //   console.log('ARRAY ITEM DETECTED')
  //   //     //   return drillFor(item[key][0], desiredKey)
  //   //     // }
  //   //     if (typeof(item[key]) === 'object') {
  //   //       // console.log('OBJECT DETECTED')
  //   //       return drillFor(item[key], desiredKey)
  //   //     }
  //   //     console.log('NO AUTHOR FOUND')
  //   //     return 'idkProbablyDoesntMatter';
  //   //   }
  //   // })
  // }

  function unpacker(obj, desiredKey) {
    // This is fake recursion
    let result = 'DELETED';
    let queue = [obj];
    while (queue.length > 0) {
      const currentObj = queue.shift();
      Object.keys(currentObj).map(key => {
        if (key === desiredKey) {
          result = currentObj[key];
          // break;
        } else {
          if (Array.isArray(currentObj[key]) && currentObj[key].length === 1) {
            // console.log('ARRAY DETECTED')
            queue.push(currentObj[key][0]);
          }
          if (typeof(currentObj[key]) === 'object') {
            queue.push(currentObj[key]);
          }
        }
      })
    }
    return result;
  }

  function restructureObj(obj, ...args) {
    // Step 1 is to find the array of many objects
    // THIS FUNCTION SHOULD RETURN AN ARRAY OF SIMPLIFIED OBJECTS OR VALUES
    // console.log('THESE ARE THE ARGS')
    // console.log(args)
    const desiredKeys = [...args];
    const dataArray = obj[Object.keys(obj)[0]]
    if (desiredKeys.length === 0) {
      return obj;
    }
    if (desiredKeys.length === 1) {
      // return dataArray.map(item => drillFor(item, desiredKeys[0]))
      return dataArray.map(item => unpacker(item, desiredKeys[0]))
    }
    if (desiredKeys.length > 1) {
      return dataArray.map(item => {
        let result = {};
        desiredKeys.map(desiredKey => {
          // result[desiredKey] = drillFor(item, desiredKey);
          result[desiredKey] = unpacker(item, desiredKey);
        });
        return result;
      })
    }
  }

  function getFiles(e) {
    e.preventDefault();
    const file = e.target.fileSelect.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      // All data pulled from the zip should be formatted as either historyObject, or a string (i.e. author name)

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

      props.setInitialState(videoHistory, postHistory, adNames, followingNames);
    }
  }

  function getFilesV2(e) {
    e.preventDefault();
    const file = e.target.fileSelect.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      // unzip the file with JSZip
      const unzippedData = await JSZip.loadAsync(e.target.result)

      // NEEDS ERROR HANDLING for cases like: 'Couldn't find videos_watched.json'

      // TESTING
      const filesToGet = {
        videoHistory: 'ads_and_topics/videos_watched.json',
        postHistory: 'ads_and_topics/posts_viewed.json',
        adNames: 'ads_and_topics/ads_viewed.json',
        followingNames: 'followers_and_following/following.json',
      }

      const myKeys = Object.keys(filesToGet); // Try using a map once this is working
      for (let i = 0; i < myKeys.length; i++) {
        filesToGet[myKeys[i]] = JSON.parse(await unzippedData.files[filesToGet[myKeys[i]]].async('string'))
      }
      // console.log(filesToGet.videoHistory);

      // console.log(restructureObj(filesToGet.videoHistory, 'value', 'timestamp'));
      // console.log(restructureObj(filesToGet.postHistory, 'value', 'timestamp'));
      // console.log(restructureObj(filesToGet.adNames, 'value'));
      // console.log(restructureObj(filesToGet.followerNames, 'value'));


      // const myKeys2 = Object.keys(filesToGet);
      for (let key of Object.keys(filesToGet)) {
        // console.log(key)
        if (key.includes('History')) {
          filesToGet[key] = restructureObj(filesToGet[key], 'value', 'timestamp');
        } else if(key.includes('Names')) {
          filesToGet[key] = restructureObj(filesToGet[key], 'value');
        }
      }
      console.log(filesToGet);
      props.setInitialStateV2(filesToGet);

      // props.setInitialState(videoHistory, postHistory, adNames, followingNames);
    }
  }

  return (
    <form onSubmit={getFilesV2}>
      <label htmlFor='fileSelect'>SELECT ZIP</label>
      <input
        type='file'
        id='fileSelect'
        name='fileSelect'
        accept='.zip'
      />
      <button>UNZIP</button>
    </form>
  )
}

export default FileSelector;
