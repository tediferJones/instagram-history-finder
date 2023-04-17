import { useState } from 'react';

function Guide() {
  const [status, setStatus] = useState('hidden')

  function toggleGuide() {
    if (status === 'hidden') {
      setStatus('block')
    } else {
      setStatus('hidden');
    }
    status === 'hidden' ? setStatus('block') : setStatus('hidden')
  }

  return (
    <div className='text-2xl p-0 m-0 flex flex-col items-center'>
      <div className='bg-gray-200'>
        <h3 onClick={toggleGuide}
          className={status === 'hidden' ? 
          'text-center p-8 duration-700 cursor-pointer hover:bg-gray-600 hover:text-white' : 
          'text-center p-8 duration-700 cursor-pointer bg-gray-600 text-white hover:bg-gray-200 hover:text-black'}
        >{status === 'hidden' ? 'Not sure what to do? Click Me!' : 'Close'}</h3>

        <ol className={'list-inside list-decimal ' + status}>
          <li className='p-8'>Sign into your instagram account from the desktop website</li>
          <ul className='px-16 list-inside list-disc'>
            <li>The mobile website and app do not provide the option to download the data as JSON</li>
          </ul>
          <li className='p-8'>Request Your Data</li>
          <ul className='px-16 list-inside list-disc'>
            <li>
              <a href='https://www.instagram.com/download/request' className='font-semibold underline'>Click Here</a> or manually navigate to More {'>'} Your Activity {'>'} Download Your Information
            </li>
            <li className='font-semibold'>MAKE SURE TO SELECT 'JSON' AS THE INFORMATION FORMAT</li>
            <li>Click next and enter your password when prompted</li>
          </ul>

          <li className='p-8'>Once your data is ready, instagram will send you an email with a link to download a zip file</li>
          <ul className='px-16 list-inside list-disc'>
            <li>Although instagram says this process could take up-to 30 days, it usually only takes a couple minutes</li>
          </ul>
          <li className='p-8'>Once the zip file has been downloaded, use the file selector below to select it, and then click UNZIP</li>
        </ol>
      </div>
    </div>
  )
}

export default Guide;
