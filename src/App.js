import React, { useCallback, useEffect, useState } from 'react'
import Calendar from './components/Calendar/Calendar'
import TodoModal from './components/TodoModal/TodoModal'
import './App.css'

export default function App() {
  const [viewDate, setViewDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  })

  const [allData, setAllData] = useState(() => {
    const saved = localStorage.getItem('calendar-planner-data')
    return saved ? JSON.parse(saved) : {}
  })

  const [aiData, setAiData] = useState(() => {
    const saved = localStorage.getItem('calendar-ai-advice')
    return saved ? JSON.parse(saved) : {}
  })

  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    localStorage.setItem('calendar-planner-data', JSON.stringify(allData))
  }, [allData])

  useEffect(() => {
    localStorage.setItem('calendar-ai-advice', JSON.stringify(aiData))
  }, [aiData])

  const updateDayTools = useCallback((dateKey, newTodos) => {
    setAllData(prev => ({ ...prev, [dateKey]: newTodos }))
  }, [])

  const updateAiAdvice = useCallback((dateKey, advice) => {
    setAiData(prev => ({ ...prev, [dateKey]: advice }))
  }, [])
  
  return (
    <div className='App'>
      <Calendar
        viewDate={viewDate}
        setViewDate={setViewDate}
        allData={allData}
        onDateClick={(date) => setSelectedDate(date)}
      />
      {/* 确保这里条件渲染正确 */}
      {selectedDate && (
        <TodoModal
          dateKey={selectedDate}
          todos={allData[selectedDate] || []}
          aiAdvice={aiData[selectedDate] || ''}
          onClose={() => setSelectedDate(null)}
          onUpdate={(newTodos) => updateDayTools(selectedDate, newTodos)}
          onAiUpdate={(advice) => updateAiAdvice(selectedDate, advice)}
        />
      )}
    </div>
  )
}