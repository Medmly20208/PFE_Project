import React from 'react'


const HowItWorksCard = (props) => {
  return (
    <div className='text-center w-[320px] border rounded-md p-[20px]'>
        <div className='flex justify-center mb-[20px]'>
           {props.icon}
        </div>
        
        <div>
            <h1 className='text-[20px] mb-[10px] font-bold'>{props.number}. {props.title}</h1>
        </div>
        <div>
            <p className='text-gray-700'>{props.description}</p>
        </div>
    </div>
  )
}

export default HowItWorksCard