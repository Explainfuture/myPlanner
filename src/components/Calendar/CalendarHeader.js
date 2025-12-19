import React, { useState, useEffect, useRef } from 'react';

/**
 * CustomSelect 组件：实现粉色滚轮交互
 */
const CustomSelect = ({ value, options, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const selectedItem = scrollRef.current.querySelector('.selected');
      if (selectedItem) {
        const containerHeight = scrollRef.current.clientHeight;
        const itemOffset = selectedItem.offsetTop;
        const itemHeight = selectedItem.clientHeight;
        scrollRef.current.scrollTop = itemOffset - containerHeight / 2 + itemHeight / 2;
      }
    }
  }, [isOpen]);

  return (
    <div className="CustomSelect" ref={containerRef}>
      <div className={`SelectTrigger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{label}</span>
        <svg 
          className={`ArrowIcon ${isOpen ? 'open' : ''}`} 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div className="ScrollMenuContainer">
          <div className="MenuGradient top"></div>
          <div className="ScrollList" ref={scrollRef}>
            {options.map((opt) => (
              <div 
                key={opt.value} 
                className={`ScrollOptionItem ${opt.value === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
          <div className="MenuGradient bottom"></div>
        </div>
      )}
    </div>
  );
};

export default function CalendarHeader({ viewDate, setViewDate }) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    yearOptions.push({ value: i, label: `${i}年` });
  }

  const monthOptions = months.map((m, i) => ({ value: i, label: m }));

  return (
    <div className="CalendarHeader">
      <div className="HeaderTitle">
        <span className="BrandText">MyPinkPlanner</span>
      </div>
      
      <div className="HeaderControls">
        <CustomSelect 
          value={viewDate.year}
          label={`${viewDate.year}年`}
          options={yearOptions}
          onChange={(val) => setViewDate({ ...viewDate, year: val })}
        />
        
        <CustomSelect 
          value={viewDate.month}
          label={months[viewDate.month]}
          options={monthOptions}
          onChange={(val) => setViewDate({ ...viewDate, month: val })}
        />
      </div>
    </div>
  );
}