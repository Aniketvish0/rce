import { useState } from 'react';
import { motion } from 'framer-motion';
import { Medal, Search, Users, Trophy, Award } from 'lucide-react';

export function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all-time');
  
  // Mock data - in a real app, this would come from an API call
  const users = [
    { rank: 1, username: 'codeMaster', problemsSolved: 157, streak: 43, points: 8750, avatar: '👨‍💻' },
    { rank: 2, username: 'algorithmQueen', problemsSolved: 142, streak: 38, points: 7920, avatar: '👩‍💻' },
    { rank: 3, username: 'devNinja', problemsSolved: 138, streak: 25, points: 7600, avatar: '🥷' },
    { rank: 4, username: 'pythonGuru', problemsSolved: 122, streak: 19, points: 6800, avatar: '🐍' },
    { rank: 5, username: 'javascriptWizard', problemsSolved: 118, streak: 15, points: 6340, avatar: '🧙‍♂️' },
    { rank: 6, username: 'codeCrafter', problemsSolved: 106, streak: 12, points: 5880, avatar: '⚒️' },
    { rank: 7, username: 'debugHero', problemsSolved: 98, streak: 8, points: 5420, avatar: '🦸‍♀️' },
    { rank: 8, username: 'syntaxSavvy', problemsSolved: 92, streak: 7, points: 5100, avatar: '🧠' },
    { rank: 9, username: 'bitwiseBaron', problemsSolved: 87, streak: 5, points: 4890, avatar: '👑' },
    { rank: 10, username: 'recursionRanger', problemsSolved: 85, streak: 3, points: 4750, avatar: '🔄' },
  ];
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-amber-700';
      default:
        return 'text-muted-foreground';
    }
  };
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you stack up against other coders on CodeHub.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-md border bg-background"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="py-2 px-4 rounded-md border bg-background"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
        </div>
        
        <div className="relative overflow-x-auto">
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="h-24 bg-gradient-to-r from-primary to-secondary relative">
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                <div className="flex items-end gap-4">
                  {users.slice(1, 2).map(user => (
                    <div key={user.rank} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-4 border-card bg-secondary flex items-center justify-center text-2xl">
                        {user.avatar}
                      </div>
                      <div className="mt-2 bg-card rounded-full px-3 py-1 text-center">
                        <div className="text-sm font-semibold">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.points} pts</div>
                      </div>
                    </div>
                  ))}
                  
                  {users.slice(0, 1).map(user => (
                    <div key={user.rank} className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full border-4 border-card bg-primary flex items-center justify-center text-3xl shadow-lg">
                        {user.avatar}
                      </div>
                      <div className="mt-2 bg-card rounded-full px-4 py-1 text-center">
                        <div className="text-sm font-semibold">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.points} pts</div>
                      </div>
                    </div>
                  ))}
                  
                  {users.slice(2, 3).map(user => (
                    <div key={user.rank} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-4 border-card bg-accent flex items-center justify-center text-2xl">
                        {user.avatar}
                      </div>
                      <div className="mt-2 bg-card rounded-full px-3 py-1 text-center">
                        <div className="text-sm font-semibold">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-24 px-4 py-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Rank</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">User</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Problems Solved</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Current Streak</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.rank}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.025)' }}
                      className="border-b last:border-b-0 dark:hover:bg-white/5"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(user.rank)}
                          <span className={`font-medium ${getRankColor(user.rank)}`}>
                            {user.rank}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg">
                            {user.avatar}
                          </div>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-primary" />
                          <span>{user.problemsSolved}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-warning" />
                          <span>{user.streak} days</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {user.points}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Code(props: any) {
  return <span {...props}>🧩</span>;
}

function Zap(props: any) {
  return <span {...props}>⚡</span>;
}