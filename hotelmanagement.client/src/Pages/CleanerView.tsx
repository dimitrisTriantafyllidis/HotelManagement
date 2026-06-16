import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, IconButton, Chip, Skeleton, Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  CleaningServices as CleanIcon,
  Build as RepairIcon,
  Refresh as RefreshIcon,
  PlayArrow as StartIcon,
  Timer as TimerIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getMaintenanceTasks, updateMaintenanceTask } from '../Services/MaintenanceTaskService';
import { MaintenanceTaskDto } from '../models/types';

type TaskStatus = 'Todo' | 'InProgress' | 'Done';

const statusConfig: Record<TaskStatus, { color: string; label: string }> = {
  Todo: { color: '#6B7280', label: 'To Do' },
  InProgress: { color: '#EAB308', label: 'In Progress' },
  Done: { color: '#22C55E', label: 'Completed' },
};

const typeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Cleaning: { color: '#3B82F6', icon: <CleanIcon /> },
  Repair: { color: '#EAB308', icon: <RepairIcon /> },
  Inspection: { color: '#C4704B', icon: <SearchIcon /> },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const } }),
  exit: { opacity: 0, x: -80, transition: { duration: 0.2 } },
};

const CleanerView: React.FC = () => {
  const [tasks, setTasks] = useState<MaintenanceTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  const [completionNotes, setCompletionNotes] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getMaintenanceTasks();
      data.sort((a, b) => {
        if (a.status === 'Done' && b.status !== 'Done') return 1;
        if (a.status !== 'Done' && b.status === 'Done') return -1;
        return 0;
      });
      setTasks(data);
    } catch { /* silently fail */ }
    setLoading(false);
  };

  const handleMarkDone = async (task: MaintenanceTaskDto) => {
    setUpdatingId(task.id);
    try {
      await updateMaintenanceTask(task.id, { id: task.id, status: 'Done', completionNotes: completionNotes[task.id] || '' });
      await loadTasks();
    } catch { /* silently fail */ }
    setUpdatingId(null);
  };

  const handleMarkInProgress = async (task: MaintenanceTaskDto) => {
    setUpdatingId(task.id);
    try {
      await updateMaintenanceTask(task.id, { id: task.id, status: 'InProgress' });
      await loadTasks();
    } catch { /* silently fail */ }
    setUpdatingId(null);
  };

  const timeSince = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const pendingCount = tasks.filter(t => t.status !== 'Done').length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h2" sx={{ color: 'var(--text-primary)' }}>Turnover Board</Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={loadTasks} size="small" sx={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 2 }}>
            <RefreshIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
        Track and complete property turnovers.
      </Typography>

      {/* Summary chips */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Pending', value: pendingCount, color: '#EAB308' },
          { label: 'Done', value: doneCount, color: '#22C55E' },
          { label: 'Total', value: tasks.length, color: '#C4704B' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
            <Box sx={{
              px: 2.5, py: 1.5, borderRadius: 3, bgcolor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              transition: 'all 0.15s ease',
              '&:hover': { borderColor: 'var(--border-strong)', boxShadow: 'var(--shadow-sm)' },
            }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', mt: 0.5, display: 'block' }}>
                {s.label}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Filter tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {(['all', 'Todo', 'InProgress', 'Done'] as const).map(f => (
          <Chip
            key={f}
            label={f === 'all' ? 'All' : f === 'InProgress' ? 'In Progress' : f}
            size="small"
            onClick={() => setFilter(f)}
            sx={{
              bgcolor: filter === f ? '#C4704B14' : 'transparent',
              color: filter === f ? '#C4704B' : 'var(--text-muted)',
              border: `1px solid ${filter === f ? '#C4704B30' : 'var(--border)'}`,
              fontWeight: filter === f ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          />
        ))}
      </Box>

      {/* Task list */}
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 3, mb: 2 }} />
        ))
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box sx={{
            p: 4, textAlign: 'center', borderRadius: 3, bgcolor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
          }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: '#22C55E', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>All caught up!</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>No tasks match your current filter.</Typography>
          </Box>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filtered.map((task, i) => {
            const cfg = statusConfig[task.status as TaskStatus] || statusConfig.Todo;
            const typeCfg = typeConfig[task.taskType] || typeConfig.Cleaning;
            const isDone = task.status === 'Done';

            return (
              <motion.div
                key={task.id}
                custom={i}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={cardVariants}
                layout
              >
                <Box sx={{
                  mb: 2, p: 2.5, borderRadius: 3, position: 'relative', overflow: 'hidden',
                  bgcolor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  opacity: isDone ? 0.6 : 1,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    transform: isDone ? 'none' : 'translateY(-2px)',
                    boxShadow: isDone ? 'none' : 'var(--shadow-md)',
                    borderColor: isDone ? 'var(--border)' : 'var(--border-strong)',
                  },
                }}>
                  <Box sx={{
                    position: 'absolute', top: 16, right: 16, width: 8, height: 8,
                    borderRadius: '50%', bgcolor: cfg.color,
                  }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{
                      p: 0.75, borderRadius: 2,
                      bgcolor: `${typeCfg.color}14`, color: typeCfg.color,
                      display: 'flex', '& svg': { fontSize: 18 },
                    }}>
                      {typeCfg.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {task.title || `${task.taskType} Task`}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {task.apartmentName}
                        {task.dueDate && ` · Due ${new Date(task.dueDate).toLocaleDateString()}`}
                      </Typography>
                    </Box>
                    <Chip
                      label={cfg.label}
                      size="small"
                      sx={{
                        bgcolor: `${cfg.color}18`, color: cfg.color,
                        border: `1px solid ${cfg.color}30`,
                        fontWeight: 600, fontSize: '0.625rem',
                      }}
                    />
                  </Box>

                  {task.description && (
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2, fontSize: '0.8125rem', pl: 5 }}>
                      {task.description}
                    </Typography>
                  )}

                  {!isDone && (
                    <Box sx={{ pl: 5 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add completion notes..."
                        value={completionNotes[task.id] || ''}
                        onChange={(e) => setCompletionNotes(prev => ({ ...prev, [task.id]: e.target.value }))}
                        sx={{ mb: 1.5 }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {task.status === 'Todo' && (
                          <Chip
                            icon={<StartIcon sx={{ fontSize: '14px !important' }} />}
                            label="Start"
                            size="small"
                            onClick={() => handleMarkInProgress(task)}
                            disabled={updatingId === task.id}
                            sx={{
                              cursor: 'pointer', bgcolor: '#C4704B14', color: '#C4704B',
                              border: '1px solid #C4704B20',
                              '&:hover': { bgcolor: '#C4704B22' },
                            }}
                          />
                        )}
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                          label={updatingId === task.id ? 'Saving...' : 'Mark Ready'}
                          size="small"
                          onClick={() => handleMarkDone(task)}
                          disabled={updatingId === task.id}
                          sx={{
                            cursor: 'pointer', bgcolor: '#22C55E14', color: '#22C55E',
                            border: '1px solid #22C55E20',
                            '&:hover': { bgcolor: '#22C55E22' },
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {isDone && task.completedAt && (
                    <Box sx={{ pl: 5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimerIcon sx={{ fontSize: 14, color: '#22C55E' }} />
                      <Typography variant="caption" sx={{ color: '#22C55E', fontSize: '0.625rem', textTransform: 'none' }}>
                        Completed {timeSince(task.completedAt)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </Box>
  );
};

export default CleanerView;
