import React, { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [val, setVal] = useState({ t: '', c: '' });

  const submit = () => {
    if (!val.t.trim()) return;
    onAdd(val.t, val.c);
    setVal({ t: '', c: '' });
  };

  return (
    <div className="ModalInputGroup">
      <input 
        placeholder="任务标题..." 
        value={val.t} 
        onChange={e => setVal({...val, t: e.target.value})}
      />
      <textarea 
        placeholder="详情备注..." 
        value={val.c} 
        onChange={e => setVal({...val, c: e.target.value})}
      />
      <button onClick={submit}>添加任务</button>
    </div>
  );
}