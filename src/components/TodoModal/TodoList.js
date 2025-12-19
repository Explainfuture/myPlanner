import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TodoItem from './TodoItem';

export default function TodoList({ todos, onDelete, onUpdate }) {
  // 核心逻辑：将任务拆分为“活动中”和“已完成”
  // 只有 activeTodos 会被放在 Draggable 标签里
  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="TodoListWrapper">
      {/* --- 1. 未完成任务：支持拖拽排序 --- */}
      <Droppable droppableId="active-tasks">
        {(provided) => (
          <div 
            className="ActiveList"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {activeTodos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`DraggableItem ${snapshot.isDragging ? 'dragging' : ''}`}
                    style={{ ...provided.draggableProps.style }}
                  >
                    <TodoItem 
                      data={todo} 
                      onDelete={onDelete} 
                      onUpdate={onUpdate} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* --- 2. 已完成任务：静态列表，自动下沉 --- */}
      {completedTodos.length > 0 && (
        <div className="CompletedSeparator">
          <span>已完成 ({completedTodos.length})</span>
        </div>
      )}
      
      <div className="CompletedList">
        {completedTodos.map(todo => (
          <TodoItem 
            key={todo.id} 
            data={todo} 
            onDelete={onDelete} 
            onUpdate={onUpdate} 
          />
        ))}
      </div>
    </div>
  );
}