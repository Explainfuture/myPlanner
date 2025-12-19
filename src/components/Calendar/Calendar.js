import React from 'react'
import CalendarHeader from './CalendarHeader'
import DateCell from './DateCell'
import { generateMonthDays } from '../../utils/calendarHelper'
import './Calendar.css'

export default function Calendar( {viewDate, setViewDate, allData, onDateClick} ) {
  const days = generateMonthDays(viewDate.year,viewDate.month)
  const weekLabels = ['Mon','Tue','Wen','Thu','Fri','Sat','Sun']
  
    return (
    <div className='CalendarContainer'>
        <CalendarHeader viewDate = {viewDate} setViewDate = {setViewDate}></CalendarHeader>
        <div className='CalendarGrid'>
            {/* 星期表头 */ }
            {weekLabels.map(label => (
                <div key={label} className='WeekLabel'>{label}</div>
            ))}

            {/* 日期格子 */}
            {days.map((item, index) => (
          <DateCell 
            key={index}
            item={item}
            hasTodos={allData[item.dateString]?.length > 0}
            onClick={() => item.type === 'current' && onDateClick(item.dateString)}
          />
        ))}
        </div>
    </div>
  )
}
