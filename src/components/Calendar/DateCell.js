import React from 'react';

export default function DateCell({ item, hasTodos, onClick }) {
  // 如果是填充的空格子（prev类型），返回一个空的div
  if (item.type === 'prev') {
    return <div className="DateCell empty"></div>;
  }

  return (
    <div className="DateCell" onClick={onClick}>
      <span className="DateNumber">{item.day}</span>
      {/* 如果有任务，显示那个蓝色小圆点 */}
      {hasTodos && <div className="Dot"></div>}
    </div>
  );
}