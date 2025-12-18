import React, { useState, useRef } from 'react'

export default function Detail({ data, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // 使用 Ref 避免在编辑时触发 React 的频繁渲染，防止光标跳动
  const titleRef = useRef(data.title);
  const contentRef = useRef(data.content);

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(data.id, {
      title: titleRef.current,
      content: contentRef.current,
      completed: data.completed
    });
  };

  return (
    <div className={`Detail ${data.completed ? 'finished' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className='left'>
        {isEditing ? (
          <div className="EditGroup">
            <span 
              className="EditInput TitleEdit" 
              contentEditable 
              suppressContentEditableWarning={true}
              onInput={(e) => titleRef.current = e.currentTarget.textContent}
            >
              {data.title}
            </span>
            <span 
              className="EditInput ContentEdit" 
              contentEditable 
              suppressContentEditableWarning={true}
              onInput={(e) => contentRef.current = e.currentTarget.textContent}
            >
              {data.content}
            </span>
          </div>
        ) : (
          <>
            <div className='Title'>{data.title}</div>
            <div className='Content'>{data.content}</div>
          </>
        )}
      </div>

      <div className="ActionGroup">
        <button className="EditBtn" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
          {isEditing ? 'Done' : '✎'}
        </button>
        
        {!isEditing && (
          <button className="DeleteBtn" onClick={() => onDelete(data.id)}>
            ×
          </button>
        )}
        
        {!isEditing && (
          <input 
            type='checkbox' 
            className='custom-checkbox' 
            checked={data.completed} 
            onChange={() => onUpdate(data.id, { ...data, completed: !data.completed })} 
          />
        )}
      </div>
    </div>
  )
}