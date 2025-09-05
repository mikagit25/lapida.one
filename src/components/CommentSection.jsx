import React, { useState } from 'react';

const demoComments = [
  { text: 'Светлая память!', date: '2024-07-01' },
  { text: 'Очень хороший человек.', date: '2024-07-02' },
];

const CommentSection = ({ comments = [], personId, onChange, demoMode }) => {
  const [list, setList] = useState(comments.length ? comments : demoComments);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text) return;
    const newComment = { text, date: new Date().toISOString().slice(0, 10) };
    const newList = [...list, newComment];
    setList(newList);
    setText('');
    if (demoMode && onChange) onChange(newList);
    if (!demoMode && onChange) onChange(newList);
  };
  const handleRemove = (idx) => {
    const newList = list.filter((_, i) => i !== idx);
    setList(newList);
    if (demoMode && onChange) onChange(newList);
    if (!demoMode && onChange) onChange(newList);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">Комментарии</h3>
      <div className="space-y-2 mb-4">
        {list.map((c, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded p-2">
            <div className="flex-1">
              <span className="font-semibold text-gray-700">{c.text}</span>
              <span className="ml-2 text-xs text-gray-400">{c.date}</span>
            </div>
            <button
              className="text-red-500 hover:text-red-700 text-lg"
              onClick={() => handleRemove(idx)}
              title="Удалить комментарий"
            >✕</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="border rounded px-2 py-1 text-sm flex-1"
          placeholder="Ваш комментарий..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
          onClick={handleAdd}
        >Добавить</button>
      </div>
      <div className="text-sm text-gray-500 mt-2">Добавьте или удалите комментарий для теста</div>
    </div>
  );
};

export default CommentSection;
