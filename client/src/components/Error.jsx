import React from 'react'

const Error = (props) => {
  return (
    <div className='bg-red-200 text-red-600 w-full p-[10px] mt-[10px]'>
      * {props.message}
    </div>
  )
}

export default Error