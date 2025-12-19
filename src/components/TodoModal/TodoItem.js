import React from 'react';

export default function TodoItem({ data, onDelete, onUpdate }) {
  return (
    <div className={`TodoItemCard ${data.completed ? 'is-completed' : ''}`}>
      {/* 1. 左侧：纯文本区域 */}
      <div className="TodoText">
        <div 
          className="ItemTitle"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate(data.id, { title: e.target.innerText })}
        >
          {data.title}
        </div>
        <div 
          className="ItemContent"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate(data.id, { content: e.target.innerText })}
        >
          {data.content}
        </div>
      </div>

      {/* 2. 右侧：操作按钮组 (完成 + 删除) */}
      <div className="ActionGroup">
        <button 
          className={`CheckBtn ${data.completed ? 'checked' : ''}`}
          onClick={() => onUpdate(data.id, { completed: !data.completed })}
          title={data.completed ? "标为未完成" : "完成任务"}
        >
          {/* 这里用一个简单的 SVG 勾选图标 */}
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="3" fill="none">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>

        <button className="ItemDelBtn" onClick={() => onDelete(data.id)} title="删除">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}