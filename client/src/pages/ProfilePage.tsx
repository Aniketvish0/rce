import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { EditIcon, User, Mail, Shield, Calendar, LogOut, CheckCircle } from 'lucide-react';

export function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  
  // Mock data
  const stats = {
    problemsSolved: 72,
    submissions: 124,
    acceptanceRate: 58,
    currentStreak: 6,
    longestStreak: 15,
    languages: [
      { name: 'JavaScript', count: 45 },
      { name: 'Python', count: 18 },
      { name: 'Java', count: 7 },
      { name: 'C++', count: 2 },
    ],
    recentActivity: [
      { type: 'solved', problem: 'Two Sum', date: '2 hours ago', difficulty: 'easy' },
      { type: 'attempted', problem: 'Merge Intervals', date: '1 day ago', difficulty: 'medium' },
      { type: 'solved', problem: 'Valid Parentheses', date: '2 days ago', difficulty: 'easy' },
      { type: 'solved', problem: 'Reverse Linked List', date: '3 days ago', difficulty: 'easy' },
    ],
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user's profile
    setIsEditing(false);
    // Update local user state
  };
  
  const handleLogout = () => {
    logout();
  };
  
  if (!user) {
    return null; // Should never reach here because of RequireAuth
  }
  
  const getInitial = () => {
    return user.username.charAt(0).toUpperCase();
  };
  
  const getProgressBarWidth = (count: number) => {
    const max = Math.max(...stats.languages.map(lang => lang.count));
    return `${(count / max) * 100}%`;
  };
  
  return (
    <div className="mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
            <div className="p-6 pt-0 relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0">
                <div className="w-20 h-20 rounded-full border-4 border-card bg-muted flex items-center justify-center text-2xl">
                  {avatar ? (
                    <img src={avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="font-bold">{getInitial()}</span>
                  )}
                </div>
              </div>
              
              <div className="mt-12 md:mt-14">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-muted-foreground text-sm">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 rounded-full bg-muted hover:bg-muted/80"
                  >
                    <EditIcon className="h-4 w-4" />
                  </motion.button>
                </div>
                
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="avatar" className="text-sm font-medium">
                        Avatar URL
                      </label>
                      <input
                        id="avatar"
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 text-sm border rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    
                    {user.isAdmin && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-accent">Admin</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 mt-6 px-4 py-2 w-full justify-center text-sm text-destructive border border-destructive/20 rounded-md hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-8">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{stats.problemsSolved}</div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{stats.submissions}</div>
                <div className="text-sm text-muted-foreground">Submissions</div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{stats.acceptanceRate}%</div>
                <div className="text-sm text-muted-foreground">Acceptance Rate</div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{stats.longestStreak}</div>
                <div className="text-sm text-muted-foreground">Longest Streak</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Languages</h3>
            
            <div className="space-y-4">
              {stats.languages.map((language) => (
                <div key={language.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{language.name}</span>
                    <span className="text-sm text-muted-foreground">{language.count} submissions</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: getProgressBarWidth(language.count) }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 py-2 border-b last:border-b-0"
                >
                  <div className={`p-2 rounded-full ${
                    activity.type === 'solved'
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {activity.type === 'solved' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <div className="h-5 w-5 flex items-center justify-center">
                        <span className="text-xs font-bold">!</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {activity.type === 'solved' ? 'Solved' : 'Attempted'}{' '}
                        <span className="font-semibold">{activity.problem}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.date}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        activity.difficulty === 'easy'
                          ? 'bg-success/10 text-success'
                          : activity.difficulty === 'medium'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}