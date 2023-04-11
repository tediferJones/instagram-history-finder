function FilterSelector(props) {
  return (
    <form>
      <label htmlFor='startDate'>FROM DATE</label>
      <input
        id='startDate'
        name='startDate'
        type='datetime-local'
        onChange={props.filterChangeHandler}
        value={props.filters.startDate}
        min={props.filters.minDate}
        max={props.filters.maxDate}
      ></input>

      <label htmlFor='endDate'>TO DATE</label>
      <input
        id='endDate'
        name='endDate'
        type='datetime-local'
        onChange={props.filterChangeHandler}
        value={props.filters.endDate}
        min={props.filters.minDate}
        max={props.filters.maxDate}
      ></input>

      <hr />

      <label htmlFor='removeAds'>Remove Ad Posts/Videos?</label>
      <input
        id='removeAds'
        name='removeAds' 
        type='checkbox' 
        onChange={props.checkboxChange} 
        value={props.filters.removeAds}
      ></input>
      
      <label htmlFor='removeFollowing'>Remove Following Posts/Videos?</label>
      <input
        id='removeFollowing'
        name='removeFollowing'
        type='checkbox'
        onChange={props.checkboxChange}
        value={props.filters.removeFollowing}
      ></input>
    </form>
  )
}

export default FilterSelector;
