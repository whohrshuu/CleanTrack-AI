import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, Medal, Star, TrendingUp } from 'lucide-react';
import { formatDate, formatNumber } from '@/utils/helpers';
import useAuthStore from '@/store/authStore';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function RewardsPage() {
  const user = useAuthStore((s) => s.user);
  const [rewards, setRewards] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rewardsRes, leaderboardRes] = await Promise.all([
          api.get('/rewards'),
          api.get('/rewards/leaderboard')
        ]);
        setRewards(rewardsRes.data);
        setLeaderboard(leaderboardRes.data);
      } catch (error) {
        toast.error('Failed to load rewards data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const badges = rewards.filter(r => r.badgeName);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Rewards & Leaderboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Track your eco-points, badges, and city ranking.</p>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-primary-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Eco Points</span>
            <Trophy size={16} className="text-primary-500" />
          </div>
          <p className="text-2xl font-semibold text-neutral-900">{formatNumber(user?.ecoPoints || 0)}</p>
          <p className="text-xs text-neutral-500 mt-1">Keep reporting to earn more!</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-accent-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">City Rank</span>
            <TrendingUp size={16} className="text-accent-500" />
          </div>
          <p className="text-2xl font-semibold text-neutral-900">
            {leaderboard.findIndex(l => l.userId === user?.id) !== -1 
              ? `#${leaderboard.findIndex(l => l.userId === user?.id) + 1}` 
              : 'N/A'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Based on eco points</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-warning-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Badges Earned</span>
            <Award size={16} className="text-warning-500" />
          </div>
          <p className="text-2xl font-semibold text-neutral-900">{badges.length}</p>
          <p className="text-xs text-neutral-500 mt-1">{rewards.length} total rewards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Badges */}
        <div className="bg-white border border-border rounded-lg">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-neutral-900">My Badges</h2>
          </div>
          <div className="p-5 space-y-3">
            {badges.length > 0 ? (
              badges.map((reward) => (
                <div key={reward.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-md">
                  <span className="text-2xl">{reward.badgeIcon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">{reward.badgeName}</p>
                    <p className="text-xs text-neutral-500">{reward.description}</p>
                  </div>
                  <span className="text-xs text-neutral-400">{formatDate(reward.earnedAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500 text-center py-4">No badges earned yet.</p>
            )}
          </div>
        </div>

        {/* Points History */}
        <div className="bg-white border border-border rounded-lg">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-neutral-900">Points History</h2>
          </div>
          <div className="divide-y divide-border-light">
            {rewards.length > 0 ? (
              rewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm text-neutral-700">{reward.description}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{formatDate(reward.earnedAt)}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary-600">+{reward.points}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500 text-center py-4">No points history yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-5 bg-white border border-border rounded-lg">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-neutral-900">City Leaderboard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                <th className="px-5 py-2.5 w-12">Rank</th>
                <th className="px-5 py-2.5">Citizen</th>
                <th className="px-5 py-2.5 text-right">Eco Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, idx) => {
                  const rank = idx + 1;
                  return (
                    <tr key={entry.userId} className={`${entry.userId === user?.id ? 'bg-primary-50/40' : 'hover:bg-neutral-50'} transition-colors`}>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-semibold ${rank <= 3 ? 'text-warning-600' : 'text-neutral-500'}`}>
                          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : `#${rank}`}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-semibold uppercase">
                            {entry.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-neutral-800">{entry.fullName}</span>
                          {entry.userId === user?.id && <span className="text-[10px] px-1.5 py-0.5 bg-primary-100 text-primary-600 rounded font-medium">You</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-sm font-medium text-neutral-700">{formatNumber(entry.ecoPoints)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="px-5 py-8 text-center text-sm text-neutral-500">No leaderboard data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
