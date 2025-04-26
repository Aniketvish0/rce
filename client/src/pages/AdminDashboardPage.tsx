import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, BookOpen, Layers, Plus, Grid3X3, Settings, ChevronDown } from 'lucide-react';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [subMenu, setSubMenu] = useState<string | null>(null);
  
  const toggleSubMenu = (menu: string) => {
    if (subMenu === menu) {
      setSubMenu(null);
    } else {
      setSubMenu(menu);
    }
  };
  
  // Mock data
  const stats = {
    users: 876,
    problems: 245,
    submissions: 12453,
    todaySubmissions: 342,
    todayUsers: 78,
    monthlySolvedProblems: [65, 72, 84, 91, 103, 112, 98, 109, 127, 142, 138, 156],
    submissionsByStatus: [
      { status: 'Accepted', count: 7842, percentage: 63 },
      { status: 'Wrong Answer', count: 2785, percentage: 22 },
      { status: 'Time Limit Exceeded', count: 1245, percentage: 10 },
      { status: 'Runtime Error', count: 417, percentage: 3 },
      { status: 'Compile Error', count: 164, percentage: 2 },
    ],
    problemsByDifficulty: [
      { difficulty: 'Easy', count: 102 },
      { difficulty: 'Medium', count: 98 },
      { difficulty: 'Hard', count: 45 },
    ],
  };
  
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card hidden md:block">
        <div className="p-4">
          <div className="py-2 px-3 rounded-md bg-primary/10 text-primary font-medium text-sm">
            Admin Dashboard
          </div>
        </div>
        
        <div className="px-3 py-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Analytics
          </div>
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              activeTab === 'overview' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              activeTab === 'users' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Users</span>
          </button>
        </div>
        
        <div className="px-3 py-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Management
          </div>
          
          <div>
            <button
              onClick={() => toggleSubMenu('problems')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                subMenu === 'problems' || activeTab.startsWith('problems') 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Problems</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${subMenu === 'problems' ? 'rotate-180' : ''}`} />
            </button>
            
            {subMenu === 'problems' && (
              <div className="pl-9 pr-3 py-1">
                <button
                  onClick={() => setActiveTab('problems-list')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                    activeTab === 'problems-list' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                  }`}
                >
                  Problem List
                </button>
                <button
                  onClick={() => setActiveTab('problems-create')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                    activeTab === 'problems-create' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                  }`}
                >
                  Create Problem
                </button>
                <button
                  onClick={() => setActiveTab('problems-categories')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                    activeTab === 'problems-categories' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                  }`}
                >
                  Categories
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setActiveTab('submissions')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              activeTab === 'submissions' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Submissions</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              activeTab === 'settings' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-1.5 text-sm rounded-md border bg-background">
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month" selected>This month</option>
                    <option value="year">This year</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Users"
                  value={stats.users}
                  icon={<Users className="h-5 w-5" />}
                  color="bg-blue-500"
                  change="+12% from last month"
                />
                <StatCard
                  title="Total Problems"
                  value={stats.problems}
                  icon={<BookOpen className="h-5 w-5" />}
                  color="bg-green-500"
                  change="+8 new problems"
                />
                <StatCard
                  title="Total Submissions"
                  value={stats.submissions}
                  icon={<Layers className="h-5 w-5" />}
                  color="bg-purple-500"
                  change={`+${stats.todaySubmissions} today`}
                />
                <StatCard
                  title="Active Users"
                  value={stats.todayUsers}
                  icon={<Users className="h-5 w-5" />}
                  color="bg-orange-500"
                  change="Current online users"
                  isToday
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly chart */}
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Monthly Solved Problems</h3>
                  <div className="h-64 flex items-end gap-2">
                    {stats.monthlySolvedProblems.map((count, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(count / Math.max(...stats.monthlySolvedProblems)) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className="w-full bg-primary rounded-t-sm"
                        ></motion.div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Status chart */}
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Submissions by Status</h3>
                  <div className="space-y-4">
                    {stats.submissionsByStatus.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.status}</span>
                          <span className="text-sm text-muted-foreground">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`h-full ${
                              index === 0 ? 'bg-success' : 
                              index === 1 ? 'bg-destructive' : 
                              index === 2 ? 'bg-warning' : 
                              'bg-muted-foreground'
                            }`}
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Problem Distribution */}
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Problems by Difficulty</h3>
                    <button className="text-sm text-primary hover:underline">View all</button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {stats.problemsByDifficulty.map((item, index) => (
                      <div key={index} className="bg-muted rounded-lg p-4">
                        <div className={`text-xl font-bold ${
                          index === 0 ? 'text-success' : 
                          index === 1 ? 'text-warning' : 
                          'text-destructive'
                        }`}>
                          {item.count}
                        </div>
                        <div className="text-sm text-muted-foreground">{item.difficulty}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium">
                      <Plus className="h-4 w-4" />
                      <span>Add New Problem</span>
                    </button>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-muted transition-colors">
                      <Plus className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">Add Problem</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-muted transition-colors">
                      <Users className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">Manage Users</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-muted transition-colors">
                      <Grid3X3 className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">Categories</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-muted transition-colors">
                      <Settings className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'problems-create' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New Problem</h1>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Problem Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        placeholder="Enter problem title"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="difficulty" className="text-sm font-medium">
                        Difficulty
                      </label>
                      <select
                        id="difficulty"
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="categories" className="text-sm font-medium">
                        Categories
                      </label>
                      <select
                        id="categories"
                        multiple
                        className="w-full px-3 py-2 border rounded-md"
                        size={4}
                      >
                        <option value="arrays">Arrays</option>
                        <option value="strings">Strings</option>
                        <option value="hash-table">Hash Table</option>
                        <option value="math">Math</option>
                        <option value="dynamic-programming">Dynamic Programming</option>
                        <option value="sorting">Sorting</option>
                        <option value="greedy">Greedy</option>
                        <option value="depth-first-search">Depth-First Search</option>
                        <option value="breadth-first-search">Breadth-First Search</option>
                        <option value="binary-search">Binary Search</option>
                        <option value="tree">Tree</option>
                        <option value="graph">Graph</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">Hold Ctrl (or Cmd) to select multiple categories</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Problem Description (Markdown)
                      </label>
                      <textarea
                        id="description"
                        placeholder="Enter problem description with examples and explanations"
                        className="w-full px-3 py-2 border rounded-md h-40"
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="constraints" className="text-sm font-medium">
                        Constraints (Markdown)
                      </label>
                      <textarea
                        id="constraints"
                        placeholder="Enter problem constraints"
                        className="w-full px-3 py-2 border rounded-md h-20"
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Starter Code
                      </label>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">JavaScript</h4>
                          </div>
                          <textarea
                            placeholder="function solution() { }"
                            className="w-full px-3 py-2 border rounded-md h-20"
                          ></textarea>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Python</h4>
                          </div>
                          <textarea
                            placeholder="def solution():"
                            className="w-full px-3 py-2 border rounded-md h-20"
                          ></textarea>
                        </div>
                        
                        <button
                          type="button"
                          className="flex items-center gap-2 text-sm text-primary"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add another language</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Test Cases
                      </label>
                      <div className="space-y-2">
                        <textarea
                          placeholder="Enter test cases, one per line"
                          className="w-full px-3 py-2 border rounded-md h-20"
                        ></textarea>
                        <button
                          type="button"
                          className="flex items-center gap-2 text-sm text-primary"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add test case</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Solution Code
                      </label>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">JavaScript</h4>
                          </div>
                          <textarea
                            placeholder="function solution() { /* Solution code */ }"
                            className="w-full px-3 py-2 border rounded-md h-20"
                          ></textarea>
                        </div>
                        
                        <button
                          type="button"
                          className="flex items-center gap-2 text-sm text-primary"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add another solution</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 border rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                    >
                      Create Problem
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {activeTab !== 'overview' && activeTab !== 'problems-create' && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">This section is under development</h2>
              <p className="text-muted-foreground mb-6">
                The {activeTab.replace('-', ' ')} page is coming soon.
              </p>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, change, isToday = false }: any) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      className="bg-card border rounded-lg p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h4 className="text-2xl font-bold mt-1">{value.toLocaleString()}</h4>
          <p className="text-xs text-muted-foreground mt-1">{change}</p>
        </div>
        <div className={`p-3 rounded-full ${color}/10`}>
          <div className={`${color} p-2 rounded-full text-white`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}