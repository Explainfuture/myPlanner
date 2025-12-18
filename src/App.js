import React, { useState, useEffect } from 'react';
import Day from './components/Day';
import './App.css';

export default function App() {
  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem('my-planner-data');
    // 如果没有数据，默认给 18 号
    return saved ? JSON.parse(saved) : [
      { id: 1734480000000, date: '2025-12-18', todos: [] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('my-planner-data', JSON.stringify(days));
  }, [days]);

  const addNewDay = () => {
    let nextDate = new Date(); // 默认是今天

    if (days.length > 0) {
      // 如果有卡片，找到最后一张卡片日期并 +1
      const lastDay = days[days.length - 1];
      const lastDate = new Date(lastDay.date);
      lastDate.setDate(lastDate.getDate() + 1);
      nextDate = lastDate;
    }

    // 格式化日期为 YYYY-MM-DD
    const dateStr = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${nextDate.getDate()}`;
    
    const newDay = { 
      id: Date.now(), 
      date: dateStr, 
      todos: [] 
    };
    
    setDays([...days, newDay]);
  };

  const deleteDay = (dayId) => {
    // 修改点：直接过滤，不再弹出 alert
    setDays(days.filter(day => day.id !== dayId));
  };

  const updateDayData = (dayId, newTodos) => {
    setDays(prevDays => prevDays.map(day => 
      day.id === dayId ? { ...day, todos: newTodos } : day
    ));
  };

  return (
    <div className="AppContainer">
      <div className="GlobalHeader">
        <h1>My Planner</h1>
        <button className="NewDayBtn" onClick={addNewDay}>+ 新增日程页</button>
      </div>

      {/* 修改点：容器类名变更，对应纵向布局 */}
      <div className="DaysStack">
        {days.map(day => (
          <Day 
            key={day.id} 
            dayId={day.id}
            initialDate={day.date} 
            initialTodos={day.todos}
            onDataChange={updateDayData}
            onDeleteDay={deleteDay}
          />
        ))}
      </div>
    </div>
  );
}