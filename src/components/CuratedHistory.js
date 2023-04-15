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

  function filterHistoryByTime(item) {
    if (item.timeStamp >= filterStartTime && item.timeStamp <= filterEndTime) {
      return true;
    }
  }

  function filterHistoryByAuthor(item) {
    return !authorToRemove.includes(item.author);
  }

  const curatedHistory = props.history.filter(filterHistoryByTime).filter(filterHistoryByAuthor);
  {/*
    flex flex-col items-center
  */}
  return (
    <div>
      <h1 className='text-3xl p-8'
      >CURATED HISTORY ({curatedHistory.length})</h1>
      <div className='flex flex-col items-center'>
        {curatedHistory.map(item => {
          return (
            <div className='p-4 m-8 w-full lg:w-3/5 flex duration-700 border-black hover:bg-gray-600 hover:text-white hover:border-white'
              key={uuidv4()}
            >
              {item.author === 'DELETED' ? <h3 className='flex-1 text-center'>DELETED</h3> : 
              <a href={`https://www.instagram.com/${item.author}`} className='flex-1 text-center'>
                <h3>@{item.author}</h3>
              </a>
              }
              <h3 className='flex-1 text-center border-current border-l-2'>{item.time}</h3>
              <h3 className='flex-1 text-center border-current border-l-2'>{item.postType}</h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CuratedHistory;
