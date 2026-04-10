
import React from 'react'

const SectionTitle = (props) => {
  return (
    <h1 className={'text-center text-4xl font-bold '+props.className} >{props.title}</h1>
  )
}

export default SectionTitle