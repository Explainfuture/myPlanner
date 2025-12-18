import React from 'react'

export default function TitleAndContent({title,content}) {
  return (
    <div className='left'>
        <div className='Title'>{title}</div>
        <div className='Content'>{content}</div>
    </div>
  )
}
