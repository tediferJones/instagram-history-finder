import { v4 as uuidv4 } from 'uuid';

function CuratedHistory(props) {
  function filterHistoryByTime(item) {
    // first filter by time, then filter out authors from remaining history
    if (item.timeStamp >= new Date(props.filters.startDate).getTime()
      && item.timeStamp <= new Date(props.filters.endDate).getTime()) {
      return true;
    }
  }

  function filterHistoryByAuthor(item) {
    // check filter boolean values, create an array of names to check against
    let authorToRemove = [];
    if (props.filters.removeAds) {
      authorToRemove = authorToRemove.concat(props.filters.adNames)
    }
    if (props.filters.removeFollowing) {
      authorToRemove = authorToRemove.concat(props.filters.followingNames)
    }

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
