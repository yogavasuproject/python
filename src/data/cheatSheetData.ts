import { CheatSheetEntry } from '../types/placement';

export const CHEAT_SHEET_DATA: CheatSheetEntry[] = [
  {
    title: 'List vs Deque: `pop(0)` vs `popleft()`',
    category: 'Time Complexity',
    code: `# List pop(0) shifts all n-1 elements -> O(n)
# Deque popleft() is doubly-linked / circular block -> O(1)
from collections import deque
q = deque([1, 2, 3])
q.append(4)     # O(1)
q.popleft()     # O(1) (List lst.pop(0) is O(n)!)`,
    complexity: 'List: O(n) vs Deque: O(1)',
    explanation: 'Using `list.pop(0)` inside a loop turns a linear BFS/Queue algorithm into $O(n^2)$ and immediately fails campus platform time limit checks.',
    interviewTip: 'When solving BFS or queue problems, always use `collections.deque` and mention "O(1) popleft vs O(n) list pop(0)" to the interviewer.',
  },
  {
    title: 'Dictionary & Set Membership: `x in structure`',
    category: 'Time Complexity',
    code: `# List lookup -> O(n) linear scan
# Set & Dict lookup -> O(1) average hash lookup
seen_set = set(nums)
if target in seen_set:  # O(1) average
    pass`,
    complexity: 'Set/Dict: O(1) avg | List: O(n)',
    explanation: 'Python sets and dictionaries are implemented via open-addressing hash tables. Checking `if x in my_set` runs in constant $O(1)$ time.',
    interviewTip: 'Convert arrays to sets before repeated lookups in two-sum, duplicates, or intersection problems.',
  },
  {
    title: 'Frequency Counter: `collections.Counter`',
    category: 'Placement 1-Liners',
    code: `from collections import Counter
counts = Counter("engineering")
# counts['e'] -> 3
# counts.most_common(2) -> [('e', 3), ('n', 2)]`,
    complexity: 'O(n) time, O(k) space',
    explanation: '`Counter` is a subclass of dictionary specifically designed for counting hashable objects. It returns 0 for missing keys instead of raising `KeyError`.',
    interviewTip: 'Use for anagram checks, majority element, first non-repeating character, and top-k frequent elements.',
  },
  {
    title: 'Multi-Key Sorting with Lambda',
    category: 'Placement 1-Liners',
    code: `students = [("Alice", 85), ("Bob", 92), ("Charlie", 85)]
# Sort by marks descending, then name ascending:
students.sort(key=lambda s: (-s[1], s[0]))
# Result: [('Bob', 92), ('Alice', 85), ('Charlie', 85)]`,
    complexity: 'O(n log n) Timsort (stable)',
    explanation: 'Negating a numeric attribute (`-s[1]`) in the tuple key reverses its individual sort order while keeping string keys ascending.',
    interviewTip: 'Python uses Timsort, which is guaranteed to be stable (preserves relative order of equal keys).',
  },
  {
    title: '`@classmethod` vs `@staticmethod`',
    category: 'OOPs & Dunder',
    code: `class Employee:
    company = "Tech Corp"

    @classmethod
    def set_company(cls, name):
        cls.company = name  # Receives class 'cls'

    @staticmethod
    def is_workday(day):
        return day not in ("Saturday", "Sunday")  # Self-contained utility`,
    explanation: '`@classmethod` receives the class object `cls` as first parameter and can modify class state. `@staticmethod` receives neither `self` nor `cls` and acts like an isolated plain function placed inside class namespace.',
    interviewTip: 'Commonly asked in Infosys and Cognizant technical interview round 2.',
  },
  {
    title: '`__str__` vs `__repr__` Dunder Methods',
    category: 'OOPs & Dunder',
    code: `class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __str__(self):
        return f"({self.x}, {self.y})"   # User-friendly for print()

    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})" # Unambiguous for developers`,
    explanation: '`__str__` goal is readable output for end users (called by `print(obj)` and `str(obj)`). `__repr__` goal is unambiguous debugging information (called by interactive REPL and lists of objects). If only `__repr__` is implemented, Python uses it for `__str__` too.',
    interviewTip: 'Remember the mnemonic: "repr is for developers, str is for users".',
  },
  {
    title: 'Modifying a List While Iterating Over It',
    category: 'Common Traps',
    code: `# TRAP:
nums = [1, 2, 3, 4, 5]
for x in nums:
    if x % 2 == 0:
        nums.remove(x)
# Result: [1, 3, 5] works here, but on [2, 4, 6] it skips 4!

# SAFE FIX: Iterate over a slice copy or use list comprehension
nums = [x for x in nums if x % 2 != 0]`,
    complexity: 'O(n) with comprehension',
    explanation: 'When modifying list size during iteration, the internal iterator index increments regardless, skipping elements that slide to the left.',
    interviewTip: 'Never call `.remove()` or `.pop()` on the same list you are iterating with `for item in lst:`. Use list comprehensions.',
  },
  {
    title: 'Default Dict vs Normal Dict: `collections.defaultdict`',
    category: 'Placement 1-Liners',
    code: `from collections import defaultdict
adj_list = defaultdict(list)
adj_list['A'].append('B')  # No need to check if 'A' in adj_list!

grouped = defaultdict(int)
grouped['count'] += 1      # Automatically initializes to 0`,
    complexity: 'O(1) access',
    explanation: 'Avoids repetitive `if key not in d: d[key] = []`. Initializes default value via factory function on first lookup.',
    interviewTip: 'Crucial for Graph adjacency lists and anagram groupings in coding tests.',
  },
];
