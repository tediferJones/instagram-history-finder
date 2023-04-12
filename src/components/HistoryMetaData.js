function HistoryMetaData(props) {
  return (
    <div>
      <h4>REMOVE ADS: {JSON.stringify(props.authorFilters.removeAds)}</h4>
      <h4>REMOVE FOLLOWING: {JSON.stringify(props.authorFilters.removeFollowing)}</h4>

      <h3>VIDEO HISTORY: {props.history.filter(item => item.postType === 'Video').length}</h3>
      <h4>VIDEO HISTORY DATA SAMPLE: {JSON.stringify(props.history.filter(item => item.postType === 'Video')[0])}</h4>

      <h3>POST HISTORY: {props.history.filter(item => item.postType === 'Post').length}</h3>
      <h4>POST HISTORY DATA SAMPLE: {JSON.stringify(props.history.filter(item => item.postType === 'Post')[0])}</h4>

      <h3>AD HISTORY: {props.authorFilters.adAuthors.length}</h3>
      <h4>AD HISTORY DATA SAMPLE: {JSON.stringify(props.authorFilters.adAuthors[0])}</h4>

      <h3>FOLLOWING: {props.authorFilters.followingAuthors.length}</h3>
      <h4>FOLLOWING DATA SAMPLE: {JSON.stringify(props.authorFilters.followingAuthors[0])}</h4>
    </div>
  )
}

export default HistoryMetaData;
