import { MentalModelConcept } from '../types/placement';

export const MENTAL_MODELS: MentalModelConcept[] = [
  {
    id: 'pass-by-object-ref',
    title: 'Pass-by-Object-Reference & Pointers',
    tagline: 'Why Python variables are luggage tags, not storage boxes',
    category: 'Memory & References',
    whyAskedInInterviews: 'Asked in TCS, Infosys, and Amazon to check whether graduates understand shallow mutation vs rebinding.',
    steps: [
      {
        step: 1,
        title: 'Step 1: Variable Assignment (Tagging)',
        codeSnippet: `a = [10, 20]
b = a`,
        pointerDiagram: {
          variables: [
            { name: 'a', targetId: 'obj_1', color: 'emerald' },
            { name: 'b', targetId: 'obj_1', color: 'azure' },
          ],
          objects: [
            { id: 'obj_1', type: 'list', value: '[10, 20]', address: '0x7ffd10' },
          ],
        },
        explanation: 'In Python, `b = a` does NOT copy the list! Both `a` and `b` hold pointers to the EXACT SAME heap object at address `0x7ffd10`.',
      },
      {
        step: 2,
        title: 'Step 2: In-place Mutation via `b.append(30)`',
        codeSnippet: `b.append(30)
# What is a? print(a) -> [10, 20, 30]!`,
        pointerDiagram: {
          variables: [
            { name: 'a', targetId: 'obj_1', color: 'emerald' },
            { name: 'b', targetId: 'obj_1', color: 'azure' },
          ],
          objects: [
            { id: 'obj_1', type: 'list', value: '[10, 20, 30]', address: '0x7ffd10' },
          ],
        },
        explanation: 'Because both variables reference the same memory slot, calling `b.append(30)` modifies the underlying object. `print(a)` now reflects `[10, 20, 30]` too!',
      },
      {
        step: 3,
        title: 'Step 3: Re-binding via Assignment `b = [99]`',
        codeSnippet: `b = [99]  # Re-binding creates a brand new object!
# a is still [10, 20, 30]`,
        pointerDiagram: {
          variables: [
            { name: 'a', targetId: 'obj_1', color: 'emerald' },
            { name: 'b', targetId: 'obj_2', color: 'violet' },
          ],
          objects: [
            { id: 'obj_1', type: 'list', value: '[10, 20, 30]', address: '0x7ffd10' },
            { id: 'obj_2', type: 'list', value: '[99]', address: '0x8bfa44' },
          ],
        },
        explanation: 'Assigning with `=` creates a NEW list on the heap and re-points `b` to it. `a` remains untouched pointing to `0x7ffd10`.',
      },
    ],
  },
  {
    id: 'mutable-defaults',
    title: 'The Mutable Default Argument Trap',
    tagline: 'Why `def func(lst=[])` persists state across multiple function calls',
    category: 'Functions & Scope',
    whyAskedInInterviews: 'Ranked #1 most asked Python trap in TCS NQT & Cognizant technical assessment rounds.',
    steps: [
      {
        step: 1,
        title: 'Function Definition Time',
        codeSnippet: `def add_item(x, target=[]):
    target.append(x)
    return target`,
        pointerDiagram: {
          variables: [
            { name: 'func.__defaults__[0]', targetId: 'default_list', color: 'amber' },
          ],
          objects: [
            { id: 'default_list', type: 'list', value: '[]', address: '0xdef001' },
          ],
        },
        explanation: 'Python evaluates default values once when the `def` statement executes. The empty list is allocated and stored inside `add_item.__defaults__`.',
      },
      {
        step: 2,
        title: 'Call 1: add_item("Apple")',
        codeSnippet: `print(add_item("Apple"))  # Output: ['Apple']`,
        pointerDiagram: {
          variables: [
            { name: 'func.__defaults__[0]', targetId: 'default_list', color: 'amber' },
            { name: 'target (call 1)', targetId: 'default_list', color: 'emerald' },
          ],
          objects: [
            { id: 'default_list', type: 'list', value: "['Apple']", address: '0xdef001' },
          ],
        },
        explanation: '`target` points to the persistent default list `0xdef001`. "Apple" is appended.',
      },
      {
        step: 3,
        title: 'Call 2: add_item("Banana")',
        codeSnippet: `print(add_item("Banana"))  # Output: ['Apple', 'Banana']!`,
        pointerDiagram: {
          variables: [
            { name: 'func.__defaults__[0]', targetId: 'default_list', color: 'amber' },
            { name: 'target (call 2)', targetId: 'default_list', color: 'violet' },
          ],
          objects: [
            { id: 'default_list', type: 'list', value: "['Apple', 'Banana']", address: '0xdef001' },
          ],
        },
        explanation: 'The second call DOES NOT get a fresh list! It points to the same `0xdef001`, producing `["Apple", "Banana"]`.',
      },
      {
        step: 4,
        title: 'The Production / Interview Fix',
        codeSnippet: `def add_item_safe(x, target=None):
    if target is None:
        target = []
    target.append(x)
    return target`,
        pointerDiagram: {
          variables: [
            { name: 'target (call 1)', targetId: 'fresh_1', color: 'emerald' },
            { name: 'target (call 2)', targetId: 'fresh_2', color: 'azure' },
          ],
          objects: [
            { id: 'fresh_1', type: 'list', value: "['Apple']", address: '0x99a01' },
            { id: 'fresh_2', type: 'list', value: "['Banana']", address: '0x99a02' },
          ],
        },
        explanation: 'Always use `target=None` as the default value, and create a fresh list inside the function body when `target is None`.',
      },
    ],
  },
  {
    id: 'slicing-mechanics',
    title: 'Slicing Step Geometry & Reversals',
    tagline: 'Understanding `arr[start : stop : step]` with zero confusion',
    category: 'Strings & Sequences',
    whyAskedInInterviews: 'Favorite output-prediction question in Wipro and Capgemini aptitude sections.',
    steps: [
      {
        step: 1,
        title: 'Positive vs Negative Indexing',
        codeSnippet: `s = "PYTHON"
# Pos:  0   1   2   3   4   5
# Char: P   Y   T   H   O   N
# Neg: -6  -5  -4  -3  -2  -1`,
        pointerDiagram: {
          variables: [
            { name: 's[0]', targetId: 'ch_0', color: 'slate' },
            { name: 's[-1]', targetId: 'ch_5', color: 'emerald' },
          ],
          objects: [
            { id: 'ch_0', type: 'char', value: "'P' (index 0 / -6)" },
            { id: 'ch_5', type: 'char', value: "'N' (index 5 / -1)" },
          ],
        },
        explanation: 'Negative index `-k` is converted by Python to `len(s) - k`. Thus `s[-1]` is `s[6 - 1] = s[5]` ("N").',
      },
      {
        step: 2,
        title: 'Step Direction Rules',
        codeSnippet: `print(s[1:5])     # "YTHO" (indices 1, 2, 3, 4; stop 5 exclusive)
print(s[1:5:2])   # "YT" (index 1, 3)
print(s[::-1])    # "NOHTYP" (reverse step)`,
        pointerDiagram: {
          variables: [
            { name: 'start', targetId: 'idx_1', color: 'azure' },
            { name: 'stop', targetId: 'idx_5', color: 'rose' },
          ],
          objects: [
            { id: 'idx_1', type: 'int', value: '1 ("Y")' },
            { id: 'idx_5', type: 'int', value: '5 ("N" - excluded)' },
          ],
        },
        explanation: 'When step is positive, start must be < stop. When step is negative, start must be > stop. If direction contradicts bounds (e.g. `s[1:5:-1]`), Python safely returns empty `""` without crashing!',
      },
    ],
  },
  {
    id: 'int-caching-identity',
    title: 'The Small Integer Cache (-5 to 256)',
    tagline: 'When `is` equals `==` and when it silently diverges',
    category: 'Memory & CPython Internals',
    whyAskedInInterviews: 'Zoho and Amazon test this to check deep systems understanding beyond syntax.',
    steps: [
      {
        step: 1,
        title: 'Small Integer Cache Pool',
        codeSnippet: `x = 100
y = 100
print(x == y, x is y)  # Output: True True`,
        pointerDiagram: {
          variables: [
            { name: 'x', targetId: 'int_100', color: 'emerald' },
            { name: 'y', targetId: 'int_100', color: 'azure' },
          ],
          objects: [
            { id: 'int_100', type: 'int', value: '100 (Single pre-cached singleton)', address: '0x10a8' },
          ],
        },
        explanation: 'CPython pre-allocates singletons for integers in the range `[-5, 256]`. Any variable assigned 100 points to the exact same pre-existing object in memory!',
      },
      {
        step: 2,
        title: 'Beyond the Cache (> 256)',
        codeSnippet: `p = 300
q = 300
# In standard interactive shell:
# p == q is True
# p is q is False!`,
        pointerDiagram: {
          variables: [
            { name: 'p', targetId: 'int_300a', color: 'violet' },
            { name: 'q', targetId: 'int_300b', color: 'amber' },
          ],
          objects: [
            { id: 'int_300a', type: 'int', value: '300', address: '0x9910' },
            { id: 'int_300b', type: 'int', value: '300', address: '0x99f8' },
          ],
        },
        explanation: 'Numbers $\\ge 257$ are created as separate objects in memory. They have the same value (`==` is True), but different memory addresses (`is` is False). Rule: Never use `is` for value equality; reserve `is` solely for `is None` and `is True/False`!',
      },
    ],
  },
];
