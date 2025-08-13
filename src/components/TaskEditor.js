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
  // 即使 task 是部分对象（如来自时间轴选择），也能正确初始化
  const [content, setContent] = useState(task.content || '');
  const [startHour, setStartHour] = useState(task.startHour !== undefined ? task.startHour : 9);
  const [duration, setDuration] = useState(task.duration || 1);
  const [quadrant, setQuadrant] = useState(task.quadrant || 'important-urgent');
  
  const handleSubmit = () => {
    // onSave 回调中包含所有信息，包括 id（如果是编辑的话）
    onSave({
      ...task, // 包含 id 等已有属性
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
            label="开始时间 (0-23)"
            type="number"
            value={startHour}
            onChange={(e) => setStartHour(parseInt(e.target.value, 10) || 0)}
            inputProps={{ min: 0, max: 23 }}
            fullWidth
          />
          
          <TextField
            label="持续时间 (小时)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10) || 1)}
            inputProps={{ min: 1, max: 24 }}
            fullWidth
          />
        </div>
        
        <div style={{ margin: '15px 0' }}>
          <Select
            value={quadrant}
            onChange={(e) => setQuadrant(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem disabled value="">
              <em>选择象限</em>
            </MenuItem>
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
        <Button onClick={handleSubmit} color="primary" variant="contained">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}