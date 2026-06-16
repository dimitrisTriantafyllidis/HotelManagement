import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, Chip, Tooltip, IconButton, Skeleton, Button,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon,
  Today as TodayIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getApartments } from '../Services/ApartmentService';
import { getBookings } from '../Services/BookingsService';
import { generateCheckoutTasks } from '../Services/MaintenanceTaskService';
import { ApartmentDto, BookingDto } from '../models/types';

const CELL_WIDTH = 48;
const ROW_HEIGHT = 56;

const platformColors: Record<string, string> = {
  Airbnb: '#FF5A5F',
  'Booking.com': '#3B82F6',
  Direct: '#22C55E',
};

const OwnerDashboard: React.FC = () => {
  const [apartments, setApartments] = useState<ApartmentDto[]>([]);
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

  const daysInView = 30;

  const dates = useMemo(() => {
    const start = new Date(viewDate);
    start.setDate(start.getDate() - 2);
    return Array.from({ length: daysInView }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [viewDate]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apts, bks] = await Promise.all([getApartments(), getBookings()]);
      setApartments(apts);
      setBookings(bks);
    } catch { /* silently fail */ }
    setLoading(false);
  };

  const shiftView = (days: number) => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() + days);
    setViewDate(d);
  };

  const getBookingsForApartment = (aptId: string) =>
    bookings.filter(b => b.apartmentId === aptId);

  const getBarStyle = (booking: BookingDto) => {
    const start = new Date(booking.checkInDate);
    const end = new Date(booking.checkOutDate);
    const viewStart = dates[0];
    const viewEnd = dates[dates.length - 1];

    if (end < viewStart || start > viewEnd) return null;

    const clampedStart = start < viewStart ? viewStart : start;
    const clampedEnd = end > viewEnd ? viewEnd : end;

    const startOffset = Math.floor((clampedStart.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, Math.ceil((clampedEnd.getTime() - clampedStart.getTime()) / (1000 * 60 * 60 * 24)));

    const color = platformColors[booking.platformSource || ''] || '#C4704B';

    return { left: startOffset * CELL_WIDTH + 2, width: duration * CELL_WIDTH - 4, color };
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
  const formatMonth = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' });

  const handleGenerateTasks = async () => {
    try {
      const tasks = await generateCheckoutTasks();
      alert(`Created ${tasks.length} checkout cleaning task(s).`);
    } catch {
      alert('Failed to generate tasks.');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ color: 'var(--text-primary)' }}>Occupancy Timeline</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Visual overview of all property bookings.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            size="small"
            startIcon={<SparkleIcon sx={{ fontSize: 16 }} />}
            onClick={handleGenerateTasks}
            sx={{
              bgcolor: '#C4704B14', color: '#C4704B',
              border: '1px solid #C4704B20',
              borderRadius: 2, px: 2, fontSize: '0.8rem',
              '&:hover': { bgcolor: '#C4704B22' },
            }}
          >
            Generate Checkout Tasks
          </Button>
          <IconButton onClick={loadData} size="small" sx={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 2 }}>
            <RefreshIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Platform legend */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {Object.entries(platformColors).map(([name, color]) => (
          <Chip
            key={name}
            label={name}
            size="small"
            sx={{
              bgcolor: `${color}18`, color,
              fontWeight: 600, fontSize: '0.625rem',
              border: `1px solid ${color}30`,
            }}
          />
        ))}
      </Box>

      {/* Timeline controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton size="small" onClick={() => shiftView(-7)} sx={{ color: 'var(--text-muted)', bgcolor: 'var(--bg-surface-secondary)', borderRadius: 2 }}>
          <ChevronLeftIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Chip
          icon={<TodayIcon sx={{ fontSize: '14px !important' }} />}
          label="Today"
          size="small"
          onClick={() => setViewDate(new Date())}
          sx={{
            cursor: 'pointer', bgcolor: '#C4704B14', color: '#C4704B',
            border: '1px solid #C4704B20', fontWeight: 600, fontSize: '0.625rem',
          }}
        />
        <IconButton size="small" onClick={() => shiftView(7)} sx={{ color: 'var(--text-muted)', bgcolor: 'var(--bg-surface-secondary)', borderRadius: 2 }}>
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="caption" sx={{ color: 'var(--text-muted)', ml: 1, textTransform: 'none' }}>
          {dates[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {dates[dates.length - 1]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Typography>
      </Box>

      {/* Gantt Chart */}
      {loading ? (
        <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Box sx={{
            borderRadius: 3, overflow: 'hidden',
            border: '1px solid var(--border)',
            bgcolor: 'var(--bg-surface)',
          }}>
            <Box sx={{ overflow: 'auto' }}>
              <Box sx={{ display: 'flex', minWidth: 200 + daysInView * CELL_WIDTH }}>
                {/* Property labels */}
                <Box sx={{ width: 200, flexShrink: 0, borderRight: '1px solid var(--border)' }}>
                  <Box sx={{
                    height: 56, px: 2, display: 'flex', alignItems: 'center',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Properties</Typography>
                  </Box>
                  {apartments.map(apt => (
                    <Box
                      key={apt.id}
                      sx={{
                        height: ROW_HEIGHT, px: 2, display: 'flex', alignItems: 'center',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.15s',
                        '&:hover': { bgcolor: 'var(--bg-surface-hover)' },
                      }}
                    >
                      <Box>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                          {apt.name}
                        </Typography>
                        {apt.location && (
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.625rem', textTransform: 'none' }}>
                            {apt.location}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Calendar grid */}
                <Box sx={{ flex: 1, position: 'relative' }}>
                  <Box sx={{ display: 'flex', height: 56, borderBottom: '1px solid var(--border)' }}>
                    {dates.map((d, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: CELL_WIDTH, flexShrink: 0, textAlign: 'center',
                          borderRight: '1px solid var(--border-subtle)',
                          bgcolor: isToday(d) ? '#C4704B0A' : isWeekend(d) ? 'var(--bg-surface-secondary)' : 'transparent',
                          py: 0.5, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{
                          fontSize: '0.55rem', color: 'var(--text-muted)', lineHeight: 1, textTransform: 'none',
                        }}>
                          {i === 0 || d.getDate() === 1 ? formatMonth(d) : ''}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: isToday(d) ? 700 : 400,
                            color: isToday(d) ? '#C4704B' : 'var(--text-primary)',
                            fontSize: '0.75rem', textTransform: 'none',
                          }}
                        >
                          {d.getDate()}
                        </Typography>
                        <Typography variant="caption" sx={{
                          fontSize: '0.5rem', color: 'var(--text-muted)', lineHeight: 1, textTransform: 'none',
                        }}>
                          {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {apartments.map(apt => (
                    <Box key={apt.id} sx={{ position: 'relative', height: ROW_HEIGHT, borderBottom: '1px solid var(--border-subtle)' }}>
                      {dates.map((d, i) => (
                        <Box
                          key={i}
                          sx={{
                            position: 'absolute', left: i * CELL_WIDTH, width: CELL_WIDTH, height: '100%',
                            borderRight: '1px solid var(--border-subtle)',
                            bgcolor: isToday(d) ? '#C4704B06' : isWeekend(d) ? 'var(--bg-surface-secondary)' : 'transparent',
                          }}
                        />
                      ))}

                      {getBookingsForApartment(apt.id).map(booking => {
                        const bar = getBarStyle(booking);
                        if (!bar) return null;
                        const guestName = `${booking.guestFirstName || ''} ${booking.guestLastName || ''}`.trim();
                        return (
                          <Tooltip
                            key={booking.id}
                            title={
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{guestName || 'Guest'}</Typography>
                                <Typography variant="caption">{booking.platformSource || 'Direct'} · {booking.status}</Typography>
                                {booking.totalPrice > 0 && (
                                  <Typography variant="caption" display="block">${booking.totalPrice}</Typography>
                                )}
                              </Box>
                            }
                          >
                            <Box
                              sx={{
                                position: 'absolute', top: 10, left: bar.left, width: bar.width,
                                height: ROW_HEIGHT - 20, borderRadius: 2,
                                bgcolor: `${bar.color}20`,
                                border: `1px solid ${bar.color}40`,
                                color: bar.color, fontSize: '0.7rem', fontWeight: 600,
                                px: 1, display: 'flex', alignItems: 'center',
                                overflow: 'hidden', whiteSpace: 'nowrap', cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                  bgcolor: `${bar.color}30`,
                                  transform: 'scaleY(1.1)',
                                  zIndex: 2,
                                },
                              }}
                            >
                              {bar.width > 70 ? (guestName || 'Guest') : bar.width > 40 ? (booking.guestFirstName?.[0] || '') + '.' : ''}
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Quick stats */}
      {!loading && (
        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'Properties', value: apartments.length, color: '#C4704B' },
            { label: 'Active Bookings', value: bookings.filter(b => b.status !== 'Cancelled').length, color: '#22C55E' },
            { label: 'This Month Revenue', value: `$${bookings.filter(b => {
              const d = new Date(b.checkInDate);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && b.status !== 'Cancelled';
            }).reduce((s, b) => s + (b.totalPrice || 0), 0).toLocaleString()}`, color: '#3B82F6' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
              <Box sx={{
                px: 2.5, py: 1.5, borderRadius: 3, bgcolor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: 'var(--border-strong)', boxShadow: 'var(--shadow-sm)' },
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>{stat.label}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OwnerDashboard;
