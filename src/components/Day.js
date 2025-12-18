import React, { useState, useEffect } from 'react';
import DateComponent from './DateComponent';

export default function Day({ dayId, initialDate, initialTodos, onDataChange, onDeleteDay }) {
  // 内部维护当前卡片的任务列表
  const [todos, setTodos] = useState(initialTodos);
  
  // 输入状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 核心：当内部 todos 变化时，立即同步给父组件 App
  useEffect(() => {
    onDataChange(dayId, todos);
  }, [todos]);

  // 添加任务
  const handleAdd = () => {
    if (!title.trim()) return;
    const newTodo = {
      id: Date.now(),
      title: title, 
      content: content || '今日新增计划', 
      completed: false
    };
    setTodos([newTodo, ...todos]);
    setTitle('');
    setContent('');
  };

  // 修改任务
  const updateTodo = (todoId, updatedData) => {
    setTodos(todos.map(t => (t.id === todoId ? { ...t, ...updatedData } : t)));
  };

  // 删除任务
  const deleteTodo = (todoId) => {
    setTodos(todos.filter(t => t.id !== todoId));
  };

  return (  
    <div className='DateCard'>
        <div className="DayHeaderRow">
            <div className="DateHeader">{initialDate}</div>
            <button className="DeleteDayBtn" onClick={() => onDeleteDay(dayId)}>×</button>
        </div>
        
        <div className="InputWrapper">
          <div className="InputGroup">
            <input 
              className="TitleInput"
              placeholder="主要任务..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <input 
              className="ContentInput"
              placeholder="备注详情..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <button className="AddBtn" onClick={handleAdd}>+</button>
        </div>

        <DateComponent 
          items={todos} 
          onUpdateTodo={updateTodo} 
          onDeleteTodo={deleteTodo} 
        />
    </div>
  );
}