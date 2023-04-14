import JSZip from 'jszip';

function FileSelector(props) {
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

  return (
    <form onSubmit={getFiles} className='flex flex-wrap justify-center items-center p-8 max-w-full'>
      <div className='flex flex-col gap-4'>
        <label className='text-lg p-4'
          htmlFor='fileSelect'
        >Please select your zip file</label>
        <input
          className='flex-shrink text-lg bg-gray-200 p-4'
          type='file'
          id='fileSelect'
          name='fileSelect'
          accept='.zip'
        />
      </div>
      <button className='text-xl bg-gray-200 p-4 m-6 hover:bg-gray-600 hover:text-white duration-700'
      >UNZIP</button>
    </form>
  )
}

export default FileSelector;
