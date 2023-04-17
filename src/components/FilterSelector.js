function FilterSelector(props) {
  let idk = 'flex items-center gap-4'
  return (
    <form className=''>
      <div className='flex flex-wrap justify-center gap-8 text-lg'>
        <div className={idk}>
          <label className='text-center cursor-pointer'
            htmlFor='filterStartDate'
          >FROM DATE</label>
          <input className='bg-gray-200 p-2 cursor-pointer duration-700 hover:bg-gray-600 hover:text-white'
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
          <label className='text-center cursor-pointer'
            htmlFor='filterEndDate'
          >TO DATE</label>
          <input className='bg-gray-200 p-2 cursor-pointer duration-700 hover:bg-gray-600 hover:text-white'
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
          <label className='cursor-pointer'
            htmlFor='removeAds'
          >Remove Ad Posts/Videos?</label>
          <input className='h-6 w-6 cursor-pointer'
            id='removeAds'
            name='removeAds' 
            type='checkbox' 
            onChange={props.authorFiltersHandler} 
            value={props.authorFilters.removeAds}
          ></input>
        </div>

        <div className='flex justify-center items-center gap-4'>
          <label className='cursor-pointer'
            htmlFor='removeFollowing'>Remove Following Posts/Videos?</label>
          <input className='h-6 w-6 cursor-pointer'
            id='removeFollowing'
            name='removeFollowing'
            type='checkbox'
            onChange={props.authorFiltersHandler}
            value={props.authorFilters.removeFollowing}
          ></input>
        </div>

        <div className='flex justify-center items-center gap-4'>
          <label className='cursor-pointer'
            htmlFor='removeDeleted'
          >Remove Deleted Posts/Videos?</label>
          <input className='h-6 w-6 cursor-pointer'
            id='removeDeleted'
            name='removeDeleted'
            type='checkbox'
            onChange={props.authorFiltersHandler}
            value={props.authorFilters.removeDeleted}
          ></input>
        </div>
      </div>

      <hr className='my-4'/>
    </form>
  )
}

export default FilterSelector;
