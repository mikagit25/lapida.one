// src/components/CommentSection.jsx
import React, { useState, useEffect } from 'react';

const CommentSection = ({ personId }) => {
  const [comments, setComments] = useState([]); // Храним комментарии
  const [newComment, setNewComment] = useState(''); // Текст нового комментария

  useEffect(() => {
    // Имитируем загрузку комментариев для человека
    const savedComments = JSON.parse(localStorage.getItem(`comments_${personId}`)) || [];
    setComments(savedComments);
  }, [personId]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      localStorage.setItem(`comments_${personId}`, JSON.stringify(updatedComments)); // Сохраняем комментарии в localStorage
      setNewComment(''); // Очищаем поле ввода
    }
  };

  return (
    <div>
      <h2>Комментарии</h2>
      <div>
        {comments.map((comment, index) => (
          <div key={index}>
            <p>{comment}</p>
          </div>
        ))}
      </div>

      <div>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Оставьте ваш комментарий"
        />
        <button onClick={handleAddComment}>Добавить комментарий</button>
      </div>
    </div>
  );
};

export default CommentSection;
