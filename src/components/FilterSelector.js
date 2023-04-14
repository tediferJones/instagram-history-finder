function FilterSelector(props) {
  let idk = 'flex items-center gap-4'
  return (
    <form className=''>
      <div className='flex flex-wrap justify-center gap-8 text-lg'>
        <div className={idk}>
          <label className='text-center'
            htmlFor='filterStartDate'
          >FROM DATE</label>
          <input className='bg-gray-200 p-2'
            id='filterStartDate'
            name='filterStartDate'
            type='datetime-local'
            onChange={props.timeFiltersHandler}
            value={props.timeFilters.filterStartDate}
            min={props.timeFilters.minDate}
            max={props.timeFilters.maxDate}
          ></input>
        </div>

        <div className={idk}>
          <label className='text-center'
            htmlFor='filterEndDate'
          >TO DATE</label>
          <input className='bg-gray-200 p-2'
            id='filterEndDate'
            name='filterEndDate'
            type='datetime-local'
            onChange={props.timeFiltersHandler}
            value={props.timeFilters.filterEndDate}
            min={props.timeFilters.minDate}
            max={props.timeFilters.maxDate}
          ></input>
        </div>
      </div>

      <hr className='my-4'/>

      <div className='flex flex-wrap justify-center gap-4 text-lg'>
        <div className='flex justify-center items-center gap-4'>
          <label htmlFor='removeAds'>Remove Ad Posts/Videos?</label>
          <input className='h-6 w-6'
            id='removeAds'
            name='removeAds' 
            type='checkbox' 
            onChange={props.authorFiltersHandler} 
            value={props.authorFilters.removeAds}
          ></input>
        </div>

        <div className='flex justify-center items-center gap-4'>
          <label htmlFor='removeFollowing'>Remove Following Posts/Videos?</label>
          <input className='h-6 w-6'
            id='removeFollowing'
            name='removeFollowing'
            type='checkbox'
            onChange={props.authorFiltersHandler}
            value={props.authorFilters.removeFollowing}
          ></input>
        </div>
      </div>
    </form>
  )
}

export default FilterSelector;
