import { v4 as uuidv4 } from 'uuid';

function CuratedHistory(props) {
  const filterStartTime = new Date(props.timeFilters.filterStartDate).getTime();
  const filterEndTime = new Date(props.timeFilters.filterEndDate).getTime();

  let authorToRemove = [];
  if (props.authorFilters.removeAds) {
    authorToRemove = authorToRemove.concat(props.authorFilters.adAuthors)
  }
  if (props.authorFilters.removeFollowing) {
    authorToRemove = authorToRemove.concat(props.authorFilters.followingAuthors)
  }
  if (props.authorFilters.removeDeleted) {
    authorToRemove = authorToRemove.concat(props.authorFilters.deletedAuthors)
  }

  function filterHistoryByTime(item) {
    if (item.timeStamp >= filterStartTime && item.timeStamp <= filterEndTime) {
      return true;
    }
  }

  function filterHistoryByAuthor(item) {
    return !authorToRemove.includes(item.author);
  }

  const curatedHistory = props.history.filter(filterHistoryByTime).filter(filterHistoryByAuthor);

  return (
    <div>
      <h1 className='text-3xl p-8'
      >CURATED HISTORY ({curatedHistory.length})</h1>
      <div className='text-xl flex flex-col items-center'>
        {curatedHistory.map(item => item.author === 'DELETED' ?
          <div className='p-4 m-4 w-full xl:w-3/5 sm:flex duration-700 bg-gray-200 border-black hover:bg-gray-600 hover:text-white hover:border-white'
              key={uuidv4()}>
              <h3 className='flex-1 m-auto text-center'>{item.author}</h3>
              <h3 className='flex-1 m-auto text-center border-current sm:border-l-2 sm:border-r-2'>{item.time}</h3>
              <h3 className='flex-1 m-auto text-center'>{item.postType}</h3>
            </div>
            :
            <a className='p-4 m-4 w-full xl:w-3/5 sm:flex duration-700 bg-gray-200 hover:bg-gray-600 hover:text-white hover:border-white'
              href={`https://www.instagram.com/${item.author}`}
              key={uuidv4()}>
              <h3 className='flex-1 m-auto text-center'>@{item.author}</h3>
              <h3 className='flex-1 m-auto text-center border-current sm:border-l-2 sm:border-r-2'>{item.time}</h3>
              <h3 className='flex-1 m-auto text-center'>{item.postType}</h3>
            </a>
        )}
      </div>
    </div>
  )
}

export default CuratedHistory;
