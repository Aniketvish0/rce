import User from '../models/user.model';
import Problem from '../models/problem.model';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
  try {
   
    const userCount = await User.count();
    
    if (userCount === 0) {
      console.log('Seeding users...');
      
     
      const adminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: adminPassword,
        isAdmin: true,
      });
      
     
      const userPassword = await bcrypt.hash('user123', 10);
      await User.create({
        username: 'user',
        email: 'user@example.com',
        password: userPassword,
        isAdmin: false,
      });
      
      console.log('Users seeded successfully');
    }
    
   
    const problemCount = await Problem.count();
    
    if (problemCount === 0) {
      console.log('Seeding problems...');
      
 
      await Problem.bulkCreate([
        {
          title: 'Two Sum',
          description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\``,
          difficulty: 'easy',
          category: ['arrays', 'hash-table'],
          starterCode: {
            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
}`,
            python: `def twoSum(nums, target):
    # Your code here
    pass`,
            'c++': `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`,
            java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
            typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
}`,
          },
          testCases: [
            'twoSum([2,7,11,15], 9)',
            'twoSum([3,2,4], 6)',
            'twoSum([3,3], 6)',
            'twoSum([1,2,3,4,5], 9)',
          ],
          solutions: {
            javascript: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
            python: `def twoSum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []`,
          },
          constraints: `- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
          hints: [
            'A brute force approach would be to check every pair of numbers, but this would be inefficient.',
            'Can we use a hash map to speed up the lookup process?',
            'As we iterate through the array, we can check if the current element\'s complement (target - nums[i]) exists in the hash map.',
          ],
        },
        {
          title: 'Valid Parentheses',
          description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
\`\`\`
Input: s = "()"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: s = "(]"
Output: false
\`\`\``,
          difficulty: 'easy',
          category: ['stack', 'strings'],
          starterCode: {
            javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your code here
}`,
            python: `def isValid(s):
    # Your code here
    pass`,
            typescript: `function isValid(s: string): boolean {
    // Your code here
}`,
          },
          testCases: [
            'isValid("()")',
            'isValid("()[]{}")',
            'isValid("(]")',
            'isValid("([)]")',
            'isValid("{[]}")',
          ],
          solutions: {
            javascript: `function isValid(s) {
    const stack = [];
    const map = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        
        if (map[char]) {
            // If it's an opening bracket, push the closing bracket to the stack
            stack.push(map[char]);
        } else {
            // If it's a closing bracket, check if it matches the top of the stack
            if (stack.pop() !== char) {
                return false;
            }
        }
    }
    
    // The stack should be empty if all brackets are matched
    return stack.length === 0;
}`,
            python: `def isValid(s):
    stack = []
    mapping = {
        '(': ')',
        '[': ']',
        '{': '}'
    }
    
    for char in s:
        if char in mapping:
            # If it's an opening bracket, push the closing bracket to the stack
            stack.append(mapping[char])
        else:
            # If it's a closing bracket, check if it matches the top of the stack
            if not stack or stack.pop() != char:
                return False
    
    # The stack should be empty if all brackets are matched
    return len(stack) == 0`,
          },
          constraints: `- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.`,
          hints: [
            'Use a stack to keep track of opening brackets.',
            'When you encounter a closing bracket, check if it matches the most recent opening bracket.',
            'The stack should be empty at the end if all brackets are properly matched and nested.',
          ],
        },
        {
          title: 'Reverse Linked List',
          description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

**Example 1:**
\`\`\`
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
\`\`\`

**Example 2:**
\`\`\`
Input: head = [1,2]
Output: [2,1]
\`\`\`

**Example 3:**
\`\`\`
Input: head = []
Output: []
\`\`\`

You are given the head of a linked list where each node contains an integer value.

A Node is defined as:

\`\`\`javascript
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}
\`\`\``,
          difficulty: 'easy',
          category: ['linked-list', 'recursion'],
          starterCode: {
            javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    // Your code here
}`,
            python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverseList(head):
    # Your code here
    pass`,
            typescript: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function reverseList(head: ListNode | null): ListNode | null {
    // Your code here
}`,
          },
          testCases: [
            `// Helper function to create a linked list from an array
function createLinkedList(arr) {
    if (!arr.length) return null;
    let head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

// Helper function to convert linked list to array
function linkedListToArray(head) {
    const result = [];
    let current = head;
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    return result;
}

// Test case
function testReverseList() {
    const arr = [1, 2, 3, 4, 5];
    const head = createLinkedList(arr);
    const reversed = reverseList(head);
    return JSON.stringify(linkedListToArray(reversed)) === JSON.stringify([5, 4, 3, 2, 1]);
}

testReverseList()`,
            `// Test case 2
function testReverseList2() {
    const arr = [1, 2];
    const head = createLinkedList(arr);
    const reversed = reverseList(head);
    return JSON.stringify(linkedListToArray(reversed)) === JSON.stringify([2, 1]);
}

testReverseList2()`,
            `// Test case 3
function testReverseList3() {
    const head = null;
    const reversed = reverseList(head);
    return reversed === null;
}

testReverseList3()`,
          ],
          solutions: {
            javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        // Save the next node
        const next = current.next;
        
        // Reverse the pointer
        current.next = prev;
        
        // Move pointers forward
        prev = current;
        current = next;
    }
    
    // At the end, prev will be the new head
    return prev;
}`,
            python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverseList(head):
    prev = None
    current = head
    
    while current:
        # Save the next node
        next_node = current.next
        
        # Reverse the pointer
        current.next = prev
        
        # Move pointers forward
        prev = current
        current = next_node
    
    # At the end, prev will be the new head
    return prev`,
          },
          constraints: `- The number of nodes in the list is the range [0, 5000].
- -5000 <= Node.val <= 5000`,
          hints: [
            'Try to use a three-pointer approach: previous, current, and next.',
            'While traversing the list, reverse the direction of the next pointer.',
            'Keep track of the previous node to set the new next pointer.',
            'Be careful about handling edge cases, like an empty list or a list with only one node.',
          ],
        },
        {
          title: 'Longest Substring Without Repeating Characters',
          description: `Given a string s, find the length of the longest substring without repeating characters.

**Example 1:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

**Example 2:**
\`\`\`
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
\`\`\`

**Example 3:**
\`\`\`
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
\`\`\``,
          difficulty: 'medium',
          category: ['hash-table', 'string', 'sliding-window'],
          starterCode: {
            javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    // Your code here
}`,
            python: `def lengthOfLongestSubstring(s):
    # Your code here
    pass`,
            typescript: `function lengthOfLongestSubstring(s: string): number {
    // Your code here
}`,
          },
          testCases: [
            'lengthOfLongestSubstring("abcabcbb")',
            'lengthOfLongestSubstring("bbbbb")',
            'lengthOfLongestSubstring("pwwkew")',
            'lengthOfLongestSubstring("")',
            'lengthOfLongestSubstring("aab")',
          ],
          solutions: {
            javascript: `function lengthOfLongestSubstring(s) {
    // Sliding window approach
    const charMap = new Map(); // Map to store the most recent index of each character
    let maxLength = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
        const currentChar = s[windowEnd];
        
        // If the character is already in the current window, move the start pointer
        if (charMap.has(currentChar) && charMap.get(currentChar) >= windowStart) {
            windowStart = charMap.get(currentChar) + 1;
        }
        
        // Update the character's position
        charMap.set(currentChar, windowEnd);
        
        // Update max length if needed
        maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
    }
    
    return maxLength;
}`,
            python: `def lengthOfLongestSubstring(s):
    # Sliding window approach
    char_map = {}  # Dictionary to store the most recent index of each character
    max_length = 0
    window_start = 0
    
    for window_end in range(len(s)):
        current_char = s[window_end]
        
        # If the character is already in the current window, move the start pointer
        if current_char in char_map and char_map[current_char] >= window_start:
            window_start = char_map[current_char] + 1
        
        # Update the character's position
        char_map[current_char] = window_end
        
        # Update max length if needed
        max_length = max(max_length, window_end - window_start + 1)
    
    return max_length`,
          },
          constraints: `- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.`,
          hints: [
            'Use a sliding window approach to track the current substring.',
            'Use a hash map or set to keep track of characters in the current window.',
            'When you encounter a repeated character, move the start of the window past the previous occurrence.',
            'Keep track of the maximum length seen so far.',
          ],
        },
        {
          title: 'Merge Intervals',
          description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

**Example 1:**
\`\`\`
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
\`\`\`

**Example 2:**
\`\`\`
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.
\`\`\``,
          difficulty: 'medium',
          category: ['arrays', 'sorting'],
          starterCode: {
            javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
    // Your code here
}`,
            python: `def merge(intervals):
    # Your code here
    pass`,
            typescript: `function merge(intervals: number[][]): number[][] {
    // Your code here
}`,
          },
          testCases: [
            'JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]])))',
            'JSON.stringify(merge([[1,4],[4,5]])))',
            'JSON.stringify(merge([[1,4],[2,3]])))',
          ],
          solutions: {
            javascript: `function merge(intervals) {
    if (intervals.length <= 1) {
        return intervals;
    }
    
    // Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const currentInterval = intervals[i];
        const lastMergedInterval = result[result.length - 1];
        
        // If the current interval overlaps with the last merged interval
        if (currentInterval[0] <= lastMergedInterval[1]) {
            // Merge the intervals by updating the end time
            lastMergedInterval[1] = Math.max(lastMergedInterval[1], currentInterval[1]);
        } else {
            // No overlap, add the current interval to the result
            result.push(currentInterval);
        }
    }
    
    return result;
}`,
            python: `def merge(intervals):
    if len(intervals) <= 1:
        return intervals
    
    # Sort intervals by start time
    intervals.sort(key=lambda x: x[0])
    
    result = [intervals[0]]
    
    for i in range(1, len(intervals)):
        current_interval = intervals[i]
        last_merged_interval = result[-1]
        
        # If the current interval overlaps with the last merged interval
        if current_interval[0] <= last_merged_interval[1]:
            # Merge the intervals by updating the end time
            last_merged_interval[1] = max(last_merged_interval[1], current_interval[1])
        else:
            # No overlap, add the current interval to the result
            result.append(current_interval)
    
    return result`,
          },
          constraints: `- 1 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= starti <= endi <= 10^4`,
          hints: [
            'Sort the intervals by their start times.',
            'Iterate through the sorted intervals and merge overlapping ones.',
            'Two intervals [a, b] and [c, d] overlap if c <= b.',
            'When merging intervals, take the maximum of the end times.',
          ],
        },
      ]);
      
      console.log('Problems seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}