import React from 'react'


//icons
import { BoltIcon } from '@heroicons/react/24/outline'

const FeatureCard = (props) => {
  return (
    <div className='p-[20px] border rounded-lg w-[320px]'>
        <div className='border  w-fit p-[5px] rounded-md mb-[20px]'>
         <BoltIcon className='w-[20px] text-black'/>
        </div>
        <h2 className='text-main-red text-[18px]'>{props.title}</h2>
        <p className='text-gray-700 font-thin'>{props.description}</p>
    </div>
  )
}

export default FeatureCard