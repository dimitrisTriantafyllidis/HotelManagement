import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, Tooltip, Skeleton } from '@mui/material';
import {
  Hotel as HotelIcon, TrendingUp as TrendingIcon, Person as PersonIcon,
  CalendarToday as CalendarIcon, CleaningServices as CleanIcon,
  CheckCircle as CheckIcon, Schedule as PendingIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as ReTooltip, Cell } from 'recharts';
import { getApartments } from '../Services/ApartmentService';
import { getBookings } from '../Services/BookingsService';
import { getMaintenanceTasks } from '../Services/MaintenanceTaskService';
import { ApartmentDto, BookingDto, MaintenanceTaskDto } from '../models/types';

type ApartmentStatus = 'Occupied' | 'Vacant' | 'Cleaning';

interface LiveCard {
  apartment: ApartmentDto;
  status: ApartmentStatus;
  currentGuest?: string;
  pendingAction: boolean;
  nextCheckIn?: string;
  revenue: number;
}

const statusConfig: Record<ApartmentStatus, { color: string; icon: React.ReactNode; label: string }> = {
  Occupied: { color: '#C4704B', icon: <PersonIcon />, label: 'Occupied' },
  Vacant: { color: '#22C55E', icon: <CheckIcon />, label: 'Vacant' },
  Cleaning: { color: '#EAB308', icon: <CleanIcon />, label: 'Cleaning' },
};

const revenueData = [
  { name: 'Jan', value: 4200 }, { name: 'Feb', value: 3800 },
  { name: 'Mar', value: 5100 }, { name: 'Apr', value: 4600 },
  { name: 'May', value: 5800 }, { name: 'Jun', value: 7200 },
  { name: 'Jul', value: 8100 },
];

const HomePage: React.FC = () => {
  const [liveCards, setLiveCards] = useState<LiveCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBookings: 0, occupancyRate: 0, revenue: 0, activeGuests: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [apartments, bookings, tasks] = await Promise.all([
        getApartments().catch(() => []),
        getBookings().catch(() => []),
        getMaintenanceTasks().catch(() => []),
      ]);
      const now = new Date();
      const cards: LiveCard[] = (apartments as ApartmentDto[]).map((apt: ApartmentDto) => {
        const activeBooking = (bookings as BookingDto[]).find(
          (b: BookingDto) => b.apartmentId === apt.id && new Date(b.checkInDate) <= now && new Date(b.checkOutDate) >= now && b.status !== 'Cancelled'
        );
        const cleaningTask = (tasks as MaintenanceTaskDto[]).find(
          (t: MaintenanceTaskDto) => t.apartmentId === apt.id && t.taskType === 'Cleaning' && t.status !== 'Done'
        );
        const nextBooking = (bookings as BookingDto[]).find(
          (b: BookingDto) => b.apartmentId === apt.id && new Date(b.checkInDate) > now && b.status !== 'Cancelled'
        );
        const aptRevenue = (bookings as BookingDto[])
          .filter((b: BookingDto) => b.apartmentId === apt.id && b.status !== 'Cancelled')
          .reduce((sum: number, b: BookingDto) => sum + (b.totalPrice || 0), 0);

        let status: ApartmentStatus = 'Vacant';
        if (activeBooking) status = 'Occupied';
        else if (cleaningTask) status = 'Cleaning';

        return {
          apartment: apt, status,
          currentGuest: activeBooking ? `${activeBooking.guestFirstName || ''} ${activeBooking.guestLastName || ''}`.trim() : undefined,
          pendingAction: !!cleaningTask || (!!activeBooking && activeBooking.status === 'Confirmed'),
          nextCheckIn: nextBooking ? new Date(nextBooking.checkInDate).toLocaleDateString() : undefined,
          revenue: aptRevenue,
        };
      });

      const occupied = cards.filter(c => c.status === 'Occupied').length;
      setLiveCards(cards);
      setStats({
        totalBookings: (bookings as BookingDto[]).length,
        occupancyRate: cards.length ? Math.round((occupied / cards.length) * 100) : 0,
        revenue: (bookings as BookingDto[]).reduce((s: number, b: BookingDto) => s + (b.totalPrice || 0), 0),
        activeGuests: occupied,
      });
    } catch { /* handled above */ }
    setLoading(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: 'var(--text-primary)', mb: 0.25 }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          Here's your property portfolio at a glance.
        </Typography>
      </Box>

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Bookings', value: stats.totalBookings, icon: <CalendarIcon sx={{ fontSize: 18 }} />, color: '#C4704B', trend: '+12%' },
          { label: 'Occupancy Rate', value: `${stats.occupancyRate}%`, icon: <TrendingIcon sx={{ fontSize: 18 }} />, color: '#22C55E', trend: '+7%' },
          { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: <HotelIcon sx={{ fontSize: 18 }} />, color: '#3B82F6', trend: '+18%' },
          { label: 'Active Guests', value: stats.activeGuests, icon: <PersonIcon sx={{ fontSize: 18 }} />, color: '#EAB308', trend: null },
        ].map((stat, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Box sx={{
                p: 2.5, borderRadius: 3, bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)',
                transition: 'all 0.15s ease',
                '&:hover': { boxShadow: 'var(--shadow-md)', borderColor: 'var(--border-strong)' },
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{
                    p: 0.75, borderRadius: 2, bgcolor: `${stat.color}14`, color: stat.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {stat.icon}
                  </Box>
                  {stat.trend && (
                    <Chip label={stat.trend} size="small"
                      sx={{ bgcolor: '#22C55E14', color: '#22C55E', fontSize: '0.625rem', height: 20, fontWeight: 600 }} />
                  )}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 0.25 }}>
                  {loading ? <Skeleton width={60} /> : stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{stat.label}</Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Property Portfolio */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ mb: 1.5, display: 'block', color: 'var(--text-muted)' }}>Property Portfolio</Typography>
        <Grid container spacing={2}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          ) : (
            liveCards.map((card, i) => {
              const cfg = statusConfig[card.status];
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={card.apartment.id}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 4) * 0.05 }}>
                    <Box
                      className={card.pendingAction ? 'warm-pulse' : ''}
                      sx={{
                        p: 2, borderRadius: 3, cursor: 'pointer', position: 'relative',
                        bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)',
                        transition: 'all 0.15s ease',
                        '&:hover': { boxShadow: 'var(--shadow-md)', borderColor: 'var(--border-strong)', transform: 'translateY(-2px)' },
                      }}
                    >
                      <Box sx={{ position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: '50%', bgcolor: cfg.color }} />

                      <Typography variant="h6" sx={{ mb: 0.25, color: 'var(--text-primary)' }}>
                        {card.apartment.name || 'Unnamed'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontSize: '0.6875rem', mb: 1.5 }}>
                        {card.apartment.location || 'No location'}
                      </Typography>

                      <Chip
                        icon={<Box sx={{ display: 'flex', '& svg': { fontSize: 12 } }}>{cfg.icon}</Box>}
                        label={cfg.label} size="small"
                        sx={{ bgcolor: `${cfg.color}14`, color: cfg.color, fontWeight: 600, fontSize: '0.625rem', mb: 1.5 }}
                      />

                      {card.currentGuest && (
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontSize: '0.625rem' }}>Current Guest</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{card.currentGuest}</Typography>
                        </Box>
                      )}

                      {card.nextCheckIn && card.status === 'Vacant' && (
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontSize: '0.625rem' }}>Next Check-in</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{card.nextCheckIn}</Typography>
                        </Box>
                      )}

                      {card.pendingAction && (
                        <Tooltip title="Action pending">
                          <Box sx={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PendingIcon sx={{ fontSize: 12, color: '#EAB308' }} />
                            <Typography sx={{ color: '#EAB308', fontSize: '0.5625rem', fontWeight: 600 }}>Pending</Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </motion.div>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>

      {/* Revenue & Stats */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }} >
          <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', mb: 0.5, display: 'block' }}>Revenue Overview</Typography>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'var(--text-primary)' }}>Monthly Performance</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} barSize={28}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <ReTooltip
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: 'var(--shadow-lg)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {revenueData.map((_, idx) => (
                    <Cell key={idx} fill={idx === revenueData.length - 1 ? '#C4704B' : '#C4704B33'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} >
          <Box sx={{
            p: 3, borderRadius: 3, bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)',
            height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', mb: 0.5, display: 'block' }}>Quick Stats</Typography>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'var(--text-primary)' }}>Portfolio Health</Typography>
            </Box>
            {[
              { label: 'Avg. Nightly Rate', value: '$142', color: '#C4704B' },
              { label: 'Avg. Stay Duration', value: '4.2 nights', color: '#22C55E' },
              { label: 'Repeat Guest Rate', value: '34%', color: '#EAB308' },
              { label: 'Response Time', value: '< 1 hour', color: '#3B82F6' },
            ].map((item, i) => (
              <Box key={i} sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                py: 1.25, borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{item.label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: item.color }}>{item.value}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
