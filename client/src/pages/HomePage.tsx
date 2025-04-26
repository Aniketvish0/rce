import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, BrainCircuit, Layers, GitFork, Trophy, ArrowRight, ChevronRight } from 'lucide-react';

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/5 dark:from-primary/20 dark:to-secondary/10" />
          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-xl w-full mx-auto md:mx-0 text-center md:text-left"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Master coding with<br />
                  <span className="text-primary">real-time feedback</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
                  Practice coding challenges, get AI-powered feedback, and improve your skills with our interactive platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    to="/problems"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Start Coding
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-6 py-3 bg-muted text-foreground rounded-md font-medium hover:bg-muted/80 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center md:justify-end w-full relative"
              >
                <div className="relative rounded-lg shadow-xl overflow-hidden max-w-md w-full">
                  <div className="relative bg-muted rounded-lg p-1">
                    <div className="bg-card rounded-md overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 border-b">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-destructive/70"></div>
                          <div className="w-3 h-3 rounded-full bg-warning/70"></div>
                          <div className="w-3 h-3 rounded-full bg-success/70"></div>
                        </div>
                        <div className="text-xs text-muted-foreground">main.js</div>
                      </div>
                      <pre className="p-4 text-sm overflow-hidden">
<code className="text-foreground"><span className="text-blue-600 dark:text-blue-400">function</span> <span className="text-yellow-600 dark:text-yellow-300">twoSum</span>(nums, target) {'{'}</code>
<code className="text-foreground">  <span className="text-blue-600 dark:text-blue-400">const</span> map = <span className="text-blue-600 dark:text-blue-400">new</span> <span className="text-yellow-600 dark:text-yellow-300">Map</span>();</code>
<code className="text-foreground">  </code>
<code className="text-foreground">  <span className="text-blue-600 dark:text-blue-400">for</span> (<span className="text-blue-600 dark:text-blue-400">let</span> i = <span className="text-purple-600 dark:text-purple-300">0</span>; i &lt; nums.length; i++) {'{'}</code>
<code className="text-foreground">    <span className="text-blue-600 dark:text-blue-400">const</span> complement = target - nums[i];</code>
<code className="text-foreground">    </code>
<code className="text-foreground">    <span className="text-blue-600 dark:text-blue-400">if</span> (map.has(complement)) {'{'}</code>
<code className="text-foreground">      <span className="text-blue-600 dark:text-blue-400">return</span> [map.get(complement), i];</code>
<code className="text-foreground">    {'}'}</code>
<code className="text-foreground">    </code>
<code className="text-foreground">    map.set(nums[i], i);</code>
<code className="text-foreground">  {'}'}</code>
<code className="text-foreground">  </code>
<code className="text-foreground">  <span className="text-blue-600 dark:text-blue-400">return</span> [];</code>
<code className="text-foreground">{'}'}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/40 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/40 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-muted/50">
          <div className="mx-auto px-4 ">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose CodeHub?</h2>
              <p className="text-muted-foreground">
                Our platform offers everything you need to master coding and prepare for technical interviews.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Multiple Languages</h3>
                <p className="text-muted-foreground">
                  Code in JavaScript, TypeScript, Python, Java, and C++ with full syntax highlighting and autocompletion.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary mb-4">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">AI Feedback</h3>
                <p className="text-muted-foreground">
                  Get personalized code reviews and suggestions powered by advanced AI to improve your solutions.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-4">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Diverse Problems</h3>
                <p className="text-muted-foreground">
                  Practice with a diverse set of problems ranging from easy to hard, categorized by topic and difficulty.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center text-success mb-4">
                  <GitFork className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Secure Execution</h3>
                <p className="text-muted-foreground">
                  Your code runs in isolated Docker containers ensuring secure and reliable execution every time.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center text-warning mb-4">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Leaderboards</h3>
                <p className="text-muted-foreground">
                  Compete with other developers and track your progress on our global and problem-specific leaderboards.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center text-destructive mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Performance Metrics</h3>
                <p className="text-muted-foreground">
                  Analyze your code's performance with detailed metrics on runtime, memory usage, and optimization suggestions.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <div className="mx-auto px-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-lg">
                <h2 className="text-3xl font-bold mb-4">Ready to improve your coding skills?</h2>
                <p className="text-primary-foreground/80 mb-0">
                  Join thousands of developers who are mastering algorithms and data structures with CodeHub.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/problems"
                  className="inline-flex items-center justify-center px-6 py-3 bg-background text-foreground rounded-md font-medium shadow-sm hover:bg-background/90 transition-colors"
                >
                  Start Practicing
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}