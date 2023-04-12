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

  return (
    <div>
      <h1>CURATED HISTORY ({curatedHistory.length})</h1>
      {curatedHistory.map(item => {
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
  )
}

export default CuratedHistory;
