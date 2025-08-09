// 任务编辑弹窗
// src/components/TaskEditor.js
import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from '@mui/material';

const QUADRANTS = [
  { id: 'important-urgent', title: '重要紧急' },
  { id: 'important-noturgent', title: '重要不紧急' },
  { id: 'notimportant-urgent', title: '不重要紧急' },
  { id: 'notimportant-noturgent', title: '不重要不紧急' }
];

export default function TaskEditor({ task, onSave, onDelete, onCancel }) {
  const [content, setContent] = useState(task.content || '');
  const [startHour, setStartHour] = useState(task.startHour || 9);
  const [duration, setDuration] = useState(task.duration || 1);
  const [quadrant, setQuadrant] = useState(task.quadrant || 'important-urgent');
  
  const handleSubmit = () => {
    onSave({
      ...task,
      content,
      startHour,
      duration,
      quadrant
    });
  };
  
  return (
    <Dialog open={true} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>{task.id ? '编辑任务' : '创建新任务'}</DialogTitle>
      <DialogContent>
        <div style={{ margin: '15px 0' }}>
          <TextField
            label="任务内容"
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            autoFocus
          />
        </div>
        
        <div style={{ display: 'flex', gap: '15px', margin: '15px 0' }}>
          <TextField
            label="开始时间"
            type="number"
            value={startHour}
            onChange={(e) => setStartHour(parseInt(e.target.value) || 0)}
            inputProps={{ min: 0, max: 23 }}
            fullWidth
          />
          
          <TextField
            label="持续时间(小时)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
            inputProps={{ min: 1, max: 24 }}
            fullWidth
          />
        </div>
        
        <div style={{ margin: '15px 0' }}>
          <Select
            value={quadrant}
            onChange={(e) => setQuadrant(e.target.value)}
            fullWidth
          >
            {QUADRANTS.map(q => (
              <MenuItem key={q.id} value={q.id}>{q.title}</MenuItem>
            ))}
          </Select>
        </div>
      </DialogContent>
      <DialogActions>
        {task.id && (
          <Button onClick={() => onDelete(task.id)} color="error">
            删除
          </Button>
        )}
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={handleSubmit} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}