import React from 'react'

const Icon = (props) => {
  return (
    <>
      {!props.icon && <img src={props.src} alt={props.alt} className={props.className}/>}
      {props.icon}
    </>
  )
}

export default Icon