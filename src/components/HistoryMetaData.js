function HistoryMetaData(props) {
  return (
    <div>
      <h4>REMOVE ADS: {JSON.stringify(props.filters.removeAds)}</h4>
      <h4>REMOVE FOLLOWING: {JSON.stringify(props.filters.removeFollowing)}</h4>

      <h3>VIDEO HISTORY: {props.history.filter(item => item.postType === 'Video').length}</h3>
      <h4>VIDEO HISTORY DATA SAMPLE: {JSON.stringify(props.history.filter(item => item.postType === 'Video')[0])}</h4>

      <h3>POST HISTORY: {props.history.filter(item => item.postType === 'Post').length}</h3>
      <h4>POST HISTORY DATA SAMPLE: {JSON.stringify(props.history.filter(item => item.postType === 'Post')[0])}</h4>

      <h3>AD HISTORY: {props.filters.adNames.length}</h3>
      <h4>AD HISTORY DATA SAMPLE: {JSON.stringify(props.filters.adNames[0])}</h4>

      <h3>FOLLOWING: {props.filters.followingNames.length}</h3>
      <h4>FOLLOWING DATA SAMPLE: {JSON.stringify(props.filters.followingNames[0])}</h4>
    </div>
  )
}

export default HistoryMetaData;
