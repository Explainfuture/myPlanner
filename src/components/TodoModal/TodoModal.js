import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function TodoModal({ dateKey, todos, onClose, onUpdate, aiAdvice, onAiUpdate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayedAiText, setDisplayedAiText] = useState('');
  const textareaRef = useRef(null);

  // 1. 备注框自动伸缩逻辑 (新增任务区域)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // 2. 任务分类
  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  // 3. 修改任务逻辑 (行内编辑保存)
  const updateSingleTodo = (id, field, value) => {
    // 只有当值真正改变时才触发更新，减少重绘
    const target = todos.find(t => t.id === id);
    if (target && target[field] === value) return;

    const newTodos = todos.map(t => t.id === id ? { ...t, [field]: value } : t);
    onUpdate(newTodos);
  };

  // 4. 拖拽逻辑优化
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    
    const newActive = Array.from(activeTodos);
    const [removed] = newActive.splice(source.index, 1);
    newActive.splice(destination.index, 0, removed);
    
    // 保持已完成任务顺序，更新总表
    onUpdate([...newActive, ...completedTodos]);
  };

  const handleToggle = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    // 切换状态后自动重新归类
    onUpdate([...updated.filter(t => !t.completed), ...updated.filter(t => t.completed)]);
  };

  // 5. DeepSeek 流式输出逻辑 (Stream)
  const handleAiPlan = async () => {
    if (activeTodos.length === 0) {
      setDisplayedAiText("大师建议：清单空空如也，先加点任务再来规划吧 ✨");
      return;
    }
    
    setLoading(true);
    setDisplayedAiText(""); 
    let fullContent = "";

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { 
              role: "system", 
              content: "你是一位精通时间管理的大师。请根据用户提供的任务列表（包括标题和备注），给出一个专业、优雅、治愈的今日安排建议。请使用清晰的换行和分点，不要使用Markdown标题符号，保持文字纯粹。" 
            },
            { 
              role: "user", 
              content: activeTodos.map(t => `- ${t.title}: ${t.content}`).join('\n') 
            }
          ],
          stream: true
        })
      });

      if (!response.ok) throw new Error('API连接失败');

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
          
          if (trimmedLine.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmedLine.substring(6));
              const contentChunk = json.choices[0].delta?.content || "";
              fullContent += contentChunk;
              setDisplayedAiText(fullContent); 
            } catch (e) {}
          }
        }
      }
      
      if (onAiUpdate) onAiUpdate(fullContent);

    } catch (error) {
      setDisplayedAiText("大师正在闭关休息中（API连线失败），请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="TodoModalOverlay" onClick={onClose}>
      <div className="TodoModalContent" onClick={e => e.stopPropagation()}>
        {/* 顶部栏 */}
        <div className="ModalHeader">
          <div className="HeaderMain">
            <h3 className="DateTitle">{dateKey} 任务清单</h3>
            <button className="AiPlanBtn" onClick={handleAiPlan} disabled={loading}>
              {loading ? '⏳ 正在构建方案...' : '✨ 安排今日任务'}
            </button>
          </div>
          <button className="CloseModalBtn" onClick={onClose}>✕</button>
        </div>

        <div className="ModalMainBody">
          {/* 左侧：任务管理区 */}
          <div className="Side HalfSection">
            <div className="HighEndInputArea">
              <input 
                className="FancyInput" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="想要完成什么任务？" 
              />
              <textarea 
                ref={textareaRef} 
                className="FancyTextarea AutoSize" 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                placeholder="详细备注信息..." 
                rows={1}
              />
              <button className="FancyAddBtn" onClick={() => {
                if(!title) return;
                onUpdate([{id: Date.now().toString(), title, content, completed: false}, ...todos]);
                setTitle(''); setContent('');
              }}>添加任务</button>
            </div>

            <div className="TaskListScroll">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="active-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="DragContainer">
                      {activeTodos.map((todo, index) => (
                        <Draggable key={todo.id} draggableId={todo.id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              className={`RefinedTaskCard ${snapshot.isDragging ? 'is-dragging' : ''}`}
                              ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                            >
                              <div className="TaskText">
                                <div 
                                  className="EditableTaskTitle" 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onBlur={(e) => updateSingleTodo(todo.id, 'title', e.target.innerText)}
                                >{todo.title}</div>
                                <div 
                                  className="EditableTaskDesc" 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onBlur={(e) => updateSingleTodo(todo.id, 'content', e.target.innerText)}
                                >{todo.content}</div>
                              </div>
                              <div className="TaskControlGroup">
                                <div className="ModernCircleCheck" onClick={() => handleToggle(todo.id)} />
                                <button className="ModernTrash" onClick={() => onUpdate(todos.filter(t => t.id !== todo.id))}>🗑️</button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {completedTodos.length > 0 && (
                <div className="CompletedWrapper">
                  <div className="CompletedDivider"><span>已完成</span></div>
                  {completedTodos.map(todo => (
                    <div key={todo.id} className="RefinedTaskCard completed-state">
                      <div className="TaskText">
                        <div className="TaskTitleText">{todo.title}</div>
                        <div className="TaskDescText">{todo.content}</div>
                      </div>
                      <div className="TaskControlGroup">
                        <div className="ModernCircleCheck active" onClick={() => handleToggle(todo.id)} />
                        <button className="ModernTrash" onClick={() => onUpdate(todos.filter(t => t.id !== todo.id))}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：AI 建议区 */}
          <div className="Side HalfSection AiRightSide">
            <div className="AiMessage">
              <span className="AiLabel">MASTER ADVICE</span>
              <div className="AiResponse">
                {displayedAiText || aiAdvice || "点击上方按钮，分析今日最佳安排"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}