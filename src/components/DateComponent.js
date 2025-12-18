import React from 'react'
import Detail from './Detail'

export default function DateComponent({ items, onUpdateTodo, onDeleteTodo }) {
  return (
    <div className="ListContainer">
        {items.map(item => (
            <Detail 
                key={item.id} 
                data={item} 
                onUpdate={onUpdateTodo} 
                onDelete={onDeleteTodo} 
            />
        ))}
    </div>
  )
}