function FilterSelector(props) {
  return (
    <form>
      <label htmlFor='filterStartDate'>FROM DATE</label>
      <input
        id='filterStartDate'
        name='filterStartDate'
        type='datetime-local'
        onChange={props.timeFiltersHandler}
        value={props.timeFilters.filterStartDate}
        min={props.timeFilters.minDate}
        max={props.timeFilters.maxDate}
      ></input>

      <label htmlFor='filterEndDate'>TO DATE</label>
      <input
        id='filterEndDate'
        name='filterEndDate'
        type='datetime-local'
        onChange={props.timeFiltersHandler}
        value={props.timeFilters.filterEndDate}
        min={props.timeFilters.minDate}
        max={props.timeFilters.maxDate}
      ></input>

      <hr />

      <label htmlFor='removeAds'>Remove Ad Posts/Videos?</label>
      <input
        id='removeAds'
        name='removeAds' 
        type='checkbox' 
        onChange={props.authorFiltersHandler} 
        value={props.authorFilters.removeAds}
      ></input>
      
      <label htmlFor='removeFollowing'>Remove Following Posts/Videos?</label>
      <input
        id='removeFollowing'
        name='removeFollowing'
        type='checkbox'
        onChange={props.authorFiltersHandler}
        value={props.authorFilters.removeFollowing}
      ></input>
    </form>
  )
}

export default FilterSelector;
