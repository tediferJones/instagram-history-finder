import JSZip from 'jszip';

function FileSelector(props) {
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

      props.setInitialState(videoHistory, postHistory, adNames, followingNames);
    }
  }

  return (
    <form onSubmit={getFiles}>
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