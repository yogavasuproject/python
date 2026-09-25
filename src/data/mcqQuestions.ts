import { MCQQuestion } from '../types/placement';

export const COMPANY_MCQS: MCQQuestion[] = [
  {
    id: 'mcq-1',
    company: 'TCS',
    roleExam: 'TCS NQT (Ninja / Digital)',
    topic: 'Functions & Scope',
    difficulty: 'Medium',
    question: 'What is the output of the following Python snippet?',
    codeSnippet: `def append_item(val, items=[]):
    items.append(val)
    return items

print(append_item(10))
print(append_item(20))
print(append_item(30, []))
print(append_item(40))`,
    options: [
      { id: 'A', text: '[10] \n[20] \n[30] \n[40]' },
      { id: 'B', text: '[10] \n[10, 20] \n[30] \n[10, 20, 40]' },
      { id: 'C', text: '[10] \n[10, 20] \n[30] \n[10, 20, 30, 40]' },
      { id: 'D', text: 'TypeError: mutable default argument' },
    ],
    correctOptionId: 'B',
    mentalModelKey: 'Mutable Default Arguments',
    explanation:
      'In Python, default arguments are evaluated only ONCE when the function definition is executed, NOT every time the function is called. The default list `items` is created once in memory. When call 1 runs without arguments, it appends 10 to that shared list. Call 2 reuses the SAME default list and appends 20 ([10, 20]). Call 3 passes a brand new explicit empty list `[]`, so only [30] is returned without touching the default. Call 4 once again reuses the shared default list, appending 40 -> [10, 20, 40].',
    memoryTrace: [
      { step: 1, title: 'Def-time Allocation', memoryState: 'items -> HeapList_101: []', desc: 'Default list created once at compile time' },
      { step: 2, title: 'Call 1: append_item(10)', memoryState: 'HeapList_101: [10]', desc: 'Mutates shared list HeapList_101' },
      { step: 3, title: 'Call 2: append_item(20)', memoryState: 'HeapList_101: [10, 20]', desc: 'Appends to the same HeapList_101' },
      { step: 4, title: 'Call 3: append_item(30, [])', memoryState: 'HeapList_202: [30]', desc: 'Explicit new list provided; default unaffected' },
      { step: 5, title: 'Call 4: append_item(40)', memoryState: 'HeapList_101: [10, 20, 40]', desc: 'Reuses HeapList_101, appending 40' },
    ],
  },
  {
    id: 'mcq-2',
    company: 'Infosys',
    roleExam: 'Infosys InfyTQ & DSY',
    topic: 'Strings',
    difficulty: 'Easy',
    question: 'What is the output of the equality and identity comparisons?',
    codeSnippet: `s1 = "campus"
s2 = "campus"
s3 = "".join(["cam", "pus"])

print(s1 == s2, s1 is s2)
print(s1 == s3, s1 is s3)`,
    options: [
      { id: 'A', text: 'True True \nTrue True' },
      { id: 'B', text: 'True True \nTrue False' },
      { id: 'C', text: 'True False \nTrue False' },
      { id: 'D', text: 'False False \nFalse False' },
    ],
    correctOptionId: 'B',
    mentalModelKey: 'Equality (==) vs Identity (is) & String Interning',
    explanation:
      '`==` tests value equality (content), whereas `is` tests memory identity (same address via id()). String literals known at compile time like "campus" are automatically interned by CPython, so s1 and s2 point to the exact same memory object (`s1 is s2` is True). However, s3 is dynamically constructed at runtime via join(), creating a distinct string object on the heap with equal content (`s1 == s3` is True, but `s1 is s3` is False).',
  },
  {
    id: 'mcq-3',
    company: 'Wipro',
    roleExam: 'Wipro Elite NLTH',
    topic: 'Slicing & Iteration',
    difficulty: 'Easy',
    question: 'What will be printed when slice step contradicts start and stop indices?',
    codeSnippet: `arr = [10, 20, 30, 40, 50, 60]
print(arr[1:4:-1])
print(arr[4:1:-1])`,
    options: [
      { id: 'A', text: '[40, 30, 20] \n[50, 40, 30]' },
      { id: 'B', text: '[] \n[50, 40, 30]' },
      { id: 'C', text: '[20, 30, 40] \n[50, 40, 30]' },
      { id: 'D', text: 'IndexError: negative step size' },
    ],
    correctOptionId: 'B',
    mentalModelKey: 'Slicing Boundaries and Step Direction',
    explanation:
      'In Python slice `[start:stop:step]`, if step is negative (-1), Python decrements the index from `start` down to `stop` (exclusive). In `arr[1:4:-1]`, starting at index 1 and moving backwards with step -1 can never reach index 4; Python detects this impossible range and returns an empty list `[]`. In `arr[4:1:-1]`, index 4 is 50, index 3 is 40, index 2 is 30 (stop at 1 exclusive), yielding `[50, 40, 30]`.',
  },
  {
    id: 'mcq-4',
    company: 'Cognizant',
    roleExam: 'Cognizant GenC Next',
    topic: 'Functions & Scope',
    difficulty: 'Medium',
    question: 'What is the result of invoking this function in Python?',
    codeSnippet: `x = 50

def compute():
    print(x)
    x = 100

compute()`,
    options: [
      { id: 'A', text: '50' },
      { id: 'B', text: '100' },
      { id: 'C', text: 'UnboundLocalError: local variable "x" referenced before assignment' },
      { id: 'D', text: 'None' },
    ],
    correctOptionId: 'C',
    mentalModelKey: 'LEGB Scope & Compile-time Variable Binding',
    explanation:
      'Python inspects functions at compile time. Because `x = 100` assigns to `x` inside the body of `compute()`, Python marks `x` as a LOCAL variable for the ENTIRE function scope. When Python tries to execute `print(x)` on the preceding line, the local variable `x` has not yet been assigned a value, raising an `UnboundLocalError`. To read the global variable before assigning, one must explicitly declare `global x`.',
  },
  {
    id: 'mcq-5',
    company: 'Amazon',
    roleExam: 'Amazon Junior SDE Campus',
    topic: 'Lists & Tuples',
    difficulty: 'Medium',
    question: 'What does the shallow matrix multiplication produce?',
    codeSnippet: `matrix = [[0] * 3] * 3
matrix[0][1] = 99
print(matrix)`,
    options: [
      { id: 'A', text: '[[0, 99, 0], [0, 0, 0], [0, 0, 0]]' },
      { id: 'B', text: '[[0, 99, 0], [0, 99, 0], [0, 99, 0]]' },
      { id: 'C', text: '[[99, 0, 0], [99, 0, 0], [99, 0, 0]]' },
      { id: 'D', text: 'TypeError: cannot assign to duplicated list' },
    ],
    correctOptionId: 'B',
    mentalModelKey: 'Shallow References via List Multiplication',
    explanation:
      '`[0] * 3` creates a single list `[0, 0, 0]`. When multiplied by 3 as `[row] * 3`, Python creates a list of 3 REFERENCES pointing to the exact same inner list in memory. Therefore, mutating `matrix[0][1]` updates that single shared list, reflecting the change across all rows. To create independent rows, use a list comprehension: `[[0] * 3 for _ in range(3)]`.',
  },
  {
    id: 'mcq-6',
    company: 'Zoho',
    roleExam: 'Zoho Core Software Engineer',
    topic: 'Dictionaries & Sets',
    difficulty: 'Medium',
    question: 'What is the length of dictionary `d` and its contents?',
    codeSnippet: `d = {}
d[1] = "Python"
d[1.0] = "Java"
d[True] = "C++"

print(len(d), d[1])`,
    options: [
      { id: 'A', text: '3 "Python"' },
      { id: 'B', text: '3 "C++"' },
      { id: 'C', text: '1 "C++"' },
      { id: 'D', text: '2 "Java"' },
    ],
    correctOptionId: 'C',
    mentalModelKey: 'Hash Table Key Collisions & Boolean Subtyping',
    explanation:
      'In Python, `bool` is a subclass of `int` where `True == 1` and `False == 0`. Furthermore, `1 == 1.0 == True` and `hash(1) == hash(1.0) == hash(True)`. When Python stores keys in a dictionary, if two keys have identical hash codes and compare equal with `==`, they occupy the exact same dictionary slot! Each subsequent assignment overwrites the previous value. Hence `len(d)` is 1 and the final value is "C++".',
  },
  {
    id: 'mcq-7',
    company: 'Accenture',
    roleExam: 'Accenture ASE / FSE',
    topic: 'Tricky Output',
    difficulty: 'Easy',
    question: 'What is the output of the chained comparison in Python?',
    codeSnippet: `print(10 == 10 == True)
print(1 < 2 < 3)
print(False == False in [False])`,
    options: [
      { id: 'A', text: 'False \nTrue \nTrue' },
      { id: 'B', text: 'True \nTrue \nTrue' },
      { id: 'C', text: 'False \nTrue \nFalse' },
      { id: 'D', text: 'True \nTrue \nFalse' },
    ],
    correctOptionId: 'A',
    mentalModelKey: 'Comparison Chaining in Python',
    explanation:
      'In Python, comparison operators chain implicitly with `and`. \n1) `10 == 10 == True` is evaluated as `(10 == 10) and (10 == True)`. While 10 == 10 is True, 10 == True is False (because True == 1, not 10). Hence result is `False`. \n2) `1 < 2 < 3` evaluates as `(1 < 2) and (2 < 3)` -> `True and True` -> `True`. \n3) `False == False in [False]` evaluates as `(False == False) and (False in [False])` -> `True and True` -> `True`.',
  },
  {
    id: 'mcq-8',
    company: 'Capgemini',
    roleExam: 'Capgemini Exceller Coding',
    topic: 'Tricky Output',
    difficulty: 'Medium',
    question: 'What is printed by the late-binding lambda list comprehension?',
    codeSnippet: `multipliers = [lambda x: x * i for i in range(4)]
print([m(2) for m in multipliers])`,
    options: [
      { id: 'A', text: '[0, 2, 4, 6]' },
      { id: 'B', text: '[6, 6, 6, 6]' },
      { id: 'C', text: '[8, 8, 8, 8]' },
      { id: 'D', text: '[0, 0, 0, 0]' },
    ],
    correctOptionId: 'B',
    mentalModelKey: 'Late Binding in Closures',
    explanation:
      'Python closures use late binding: the value of variable `i` is looked up at the time the lambda is CALLED, not when it is created. When the list comprehension finishes, the loop variable `i` has reached its final value: `3`. When `m(2)` is subsequently invoked for each function, each one evaluates `2 * 3 = 6`. To capture `i` at creation time, write `lambda x, i=i: x * i`.',
  },
  {
    id: 'mcq-9',
    company: 'TCS',
    roleExam: 'TCS NQT Advanced',
    topic: 'OOPs & Classes',
    difficulty: 'Medium',
    question: 'What is the output when class variable vs instance variable are modified?',
    codeSnippet: `class Student:
    stream = "CSE"

s1 = Student()
s2 = Student()

s1.stream = "ECE"
Student.stream = "IT"

print(s1.stream, s2.stream)`,
    options: [
      { id: 'A', text: 'ECE IT' },
      { id: 'B', text: 'IT IT' },
      { id: 'C', text: 'ECE ECE' },
      { id: 'D', text: 'CSE IT' },
    ],
    correctOptionId: 'A',
    mentalModelKey: 'Class Namespace vs Instance Namespace Lookup',
    explanation:
      'When `s1.stream = "ECE"` is executed, Python creates a new instance variable named `stream` in `s1`s private `__dict__`. It shadows the class variable for `s1`. However, `s2` has no instance variable `stream`, so looking up `s2.stream` falls back to the class attribute on `Student`, which was modified to "IT". Result: "ECE IT".',
  },
  {
    id: 'mcq-10',
    company: 'Infosys',
    roleExam: 'Infosys Specialist Programmer',
    topic: 'Recursion & Math',
    difficulty: 'Medium',
    question: 'What will be the return value of this recursive function?',
    codeSnippet: `def solve(n):
    if n <= 1:
        return 1
    if n % 2 == 0:
        return solve(n // 2) + n
    else:
        return solve(n - 1) * 2

print(solve(6))`,
    options: [
      { id: 'A', text: '14' },
      { id: 'B', text: '16' },
      { id: 'C', text: '12' },
      { id: 'D', text: '18' },
    ],
    correctOptionId: 'C',
    mentalModelKey: 'Recursive Call Stack Tracing',
    explanation:
      'Tracing execution step-by-step: \\n1) solve(6): 6 is even -> solve(3) + 6. \\n2) solve(3): 3 is odd -> solve(2) * 2. \\n3) solve(2): 2 is even -> solve(1) + 2. \\n4) solve(1): base case -> returns 1. \\nUnwinding the stack: \\nsolve(2) = 1 + 2 = 3. \\nsolve(3) = 3 * 2 = 6. \\nsolve(6) = 6 + 6 = 12.',
  },
  {
    id: 'mcq-11',
    company: 'Wipro',
    roleExam: 'Wipro NLTH Coding',
    topic: 'Lists & Tuples',
    difficulty: 'Easy',
    question: 'What happens when modifying a mutable element inside an immutable tuple?',
    codeSnippet: `t = (1, 2, [30, 40])
try:
    t[2] += [50]
except TypeError:
    pass

print(t)`,
    options: [
      { id: 'A', text: '(1, 2, [30, 40])' },
      { id: 'B', text: '(1, 2, [30, 40, 50])' },
      { id: 'C', text: 'TypeError without modifying the list' },
      { id: 'D', text: '(1, 2, 50)' },
    ],
    correctOptionId: 'B',
    mentalModelKey: 'In-place List Mutation vs Tuple Assignment',
    explanation:
      'This is a famous Python quiz trap! `t[2] += [50]` translates under the hood to `t[2].extend([50])` followed by `t[2] = result`. The in-place `.extend([50])` succeeds, modifying the inner list to `[30, 40, 50]`. But the subsequent assignment back to index 2 of tuple `t` throws a `TypeError` because tuples are immutable. Since the exception is caught, printing `t` reveals that the list WAS mutated!',
  },
  {
    id: 'mcq-12',
    company: 'Cognizant',
    roleExam: 'Cognizant GenC Elevate',
    topic: 'Dictionaries & Sets',
    difficulty: 'Easy',
    question: 'Which of the following elements CANNOT be added to a Python set?',
    codeSnippet: `s = set()
s.add("Placement")
s.add(2026)
s.add((1, 2, 3))
# Which of the following would throw TypeError: unhashable type?
# Option A: (1, [2, 3])
# Option B: frozenset([1, 2])
# Option C: None
# Option D: 3.1415`,
    options: [
      { id: 'A', text: '(1, [2, 3])' },
      { id: 'B', text: 'frozenset([1, 2])' },
      { id: 'C', text: 'None' },
      { id: 'D', text: '3.1415' },
    ],
    correctOptionId: 'A',
    mentalModelKey: 'Set Element Hashability',
    explanation:
      'Set elements must be hashable. Although a tuple is immutable, if any element inside the tuple is mutable (like list `[2, 3]`), the entire tuple becomes unhashable and raises `TypeError: unhashable type: "list"`. Frozenset, None, and float are all hashable and valid.',
  },
];
