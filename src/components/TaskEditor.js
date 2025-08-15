import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { addHours, isBefore, isSameDay } from 'date-fns';

const QUADRANTS = [
  { id: 'important-urgent', title: '重要紧急' },
  { id: 'important-noturgent', title: '重要不紧急' },
  { id: 'notimportant-urgent', title: '不重要紧急' },
  { id: 'notimportant-noturgent', title: '不重要不紧急' }
];

export default function TaskEditor({ task, onSave, onDelete, onCancel }) {
  const defaultStartTime = task.startTime || new Date();
  const defaultEndTime = task.endTime || addHours(defaultStartTime, task.duration || 1);

  const [content, setContent] = useState(task.content || '');
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [quadrant, setQuadrant] = useState(task.quadrant || 'important-urgent');

  const handleSubmit = () => {
    if (isBefore(endTime, startTime) || !isSameDay(startTime, endTime)) {
        alert("开始时间不能晚于结束时间，且必须在同一天。");
        return;
    }
    onSave({
      ...task,
      content,
      startTime,
      endTime,
      quadrant
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            <DateTimePicker
              label="开始时间"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DateTimePicker
              label="结束时间"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
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
    </LocalizationProvider>
  );
}