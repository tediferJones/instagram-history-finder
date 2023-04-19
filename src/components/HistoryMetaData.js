function HistoryMetaData(props) {
  return (
    <div className='text-xl flex flex-wrap justify-center gap-12 my-4'>
      <h3>VIDEO HISTORY: {props.history.filter(item => item.postType === 'Video').length}</h3>
      <h3>POST HISTORY: {props.history.filter(item => item.postType === 'Post').length}</h3>
      <h3>AD HISTORY: {props.authorFilters.adAuthors.length}</h3>
      <h3>FOLLOWING: {props.authorFilters.followingAuthors.length}</h3>
    </div>
  )
}

export default HistoryMetaData;
