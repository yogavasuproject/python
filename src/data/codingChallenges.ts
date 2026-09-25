import { CodingChallenge } from '../types/placement';

export const COMPANY_CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'code-1',
    title: 'Move Zeroes to End',
    company: 'TCS',
    roleExam: 'TCS NQT Hands-on Round',
    topic: 'Lists & Tuples',
    difficulty: 'Easy',
    frequency: 'Top Repeated',
    description: `Given an array of integers \`arr\`, move all \`0\`s to the end of it while maintaining the relative order of the non-zero elements.

You must do this in-place with $O(n)$ time complexity and $O(1)$ extra space. Do not simply count zeroes and create a new list if an in-place modification is asked by the interviewer!`,
    constraints: [
      '1 <= len(arr) <= 10^5',
      '-2^31 <= arr[i] <= 2^31 - 1',
      'Time complexity must be O(n)',
      'Auxiliary Space complexity must be O(1)',
    ],
    inputFormat: 'A single line of space-separated integers, e.g. "0 1 0 3 12"',
    outputFormat: 'Space-separated integers with all zeroes moved to the end, e.g. "1 3 12 0 0"',
    sampleCases: [
      {
        input: '0 1 0 3 12',
        expectedOutput: '1 3 12 0 0',
        explanation: 'The non-zero elements are 1, 3, 12. Maintaining their relative order gives 1 3 12 followed by two zeroes.',
      },
      {
        input: '0 0 0',
        expectedOutput: '0 0 0',
        explanation: 'All zeroes remain unchanged.',
      },
      {
        input: '4 5 6',
        expectedOutput: '4 5 6',
        explanation: 'No zeroes exist; array remains identical.',
      },
    ],
    hiddenTestCases: [
      {
        name: 'Trailing zero with alternating values',
        input: '1 0 2 0 3 0',
        expectedOutput: '1 2 3 0 0 0',
        isHidden: true,
      },
      {
        name: 'Single zero element',
        input: '0',
        expectedOutput: '0',
        isHidden: true,
      },
      {
        name: 'Negative numbers and zeroes',
        input: '-1 0 -5 0 9',
        expectedOutput: '-1 -5 9 0 0',
        isHidden: true,
      },
    ],
    starterCode: `import sys

def move_zeroes(arr):
    # Write your in-place logic here
    # Target: O(n) time and O(1) space
    insert_pos = 0
    for num in arr:
        if num != 0:
            arr[insert_pos] = num
            insert_pos += 1
            
    while insert_pos < len(arr):
        arr[insert_pos] = 0
        insert_pos += 1
    return arr

# Driver script for placement evaluation
if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if not raw:
        print("")
    else:
        nums = list(map(int, raw.split()))
        result = move_zeroes(nums)
        print(" ".join(map(str, result)))
`,
    solutionCode: `def move_zeroes(arr):
    """
    Two-pointer / Writer-pointer approach:
    O(n) time, O(1) space.
    """
    write_idx = 0
    for read_idx in range(len(arr)):
        if arr[read_idx] != 0:
            arr[write_idx], arr[read_idx] = arr[read_idx], arr[write_idx]
            write_idx += 1
    return arr
`,
    oneLinerAlternative: `# Pythonic shortcut (O(n) space):
sorted_zeroes = [x for x in arr if x != 0] + [0] * arr.count(0)`,
    intuition:
      'Imagine a "write pointer" sitting at the start of the list. Iterate through the array. Every time you see a non-zero number, swap it with the element at the write pointer and advance the write pointer. All zeroes naturally bubble to the right!',
    timeComplexity: 'O(n) - Single pass over the array of size n',
    spaceComplexity: 'O(1) - Modified strictly in-place with two pointers',
    commonPitfalls: [
      'Using `arr.remove(0)` inside a loop: `remove()` is O(n), causing O(n^2) Time Limit Exceeded (TLE) on large test inputs.',
      'Modifying list length while iterating with `for i in arr:` causes skipped elements.',
    ],
  },
  {
    id: 'code-2',
    title: 'First Non-Repeating Character',
    company: 'Infosys',
    roleExam: 'Infosys InfyTQ / DSY Coding',
    topic: 'Strings',
    difficulty: 'Easy',
    frequency: 'Top Repeated',
    description: `Given a string \`s\`, find the first non-repeating character and print it. If every character in the string repeats, print \`$\`.

Placement tests frequently test string frequency counting and index preservation.`,
    constraints: [
      '1 <= len(s) <= 10^5',
      'The string consists of lowercase English letters only',
    ],
    inputFormat: 'A single string, e.g. "swiss"',
    outputFormat: 'The first non-repeating character, or "$" if none exists',
    sampleCases: [
      {
        input: 'swiss',
        expectedOutput: 'w',
        explanation: '"s" repeats 3 times. "w" appears once and is the first unique character.',
      },
      {
        input: 'aabbcc',
        expectedOutput: '$',
        explanation: 'All characters repeat, so output "$".',
      },
      {
        input: 'placement',
        expectedOutput: 'p',
        explanation: '"p" is the first character and only appears once.',
      },
    ],
    hiddenTestCases: [
      {
        name: 'Single character string',
        input: 'z',
        expectedOutput: 'z',
        isHidden: true,
      },
      {
        name: 'Unique character at the very end',
        input: 'aabbccd',
        expectedOutput: 'd',
        isHidden: true,
      },
      {
        name: 'Long repeating sequence',
        input: 'abacabad',
        expectedOutput: 'c',
        isHidden: true,
      },
    ],
    starterCode: `import sys
from collections import Counter

def first_unique_char(s):
    # TODO: Build frequency map in O(n) time
    # Return first character with count == 1, else '$'
    pass

if __name__ == '__main__':
    s = sys.stdin.read().strip()
    if not s:
        print("$")
    else:
        print(first_unique_char(s))
`,
    solutionCode: `from collections import Counter

def first_unique_char(s: str) -> str:
    # Pass 1: Count frequency of each character in O(n)
    freq = Counter(s)
    
    # Pass 2: Find the first character in original order with count == 1
    for ch in s:
        if freq[ch] == 1:
            return ch
            
    return '$'
`,
    oneLinerAlternative: `next((ch for ch in s if s.count(ch) == 1), '$')  # Warning: s.count inside generator makes it O(n^2)`,
    intuition:
      'A naive approach of using `s.count(ch)` for each character results in O(n^2) TLE. The optimal placement solution does 2 passes: Pass 1 builds a frequency dictionary in O(n). Pass 2 iterates through `s` once more to find the first character whose count is 1.',
    timeComplexity: 'O(n) - Two linear passes over length n',
    spaceComplexity: 'O(k) where k <= 26 English alphabets -> O(1) auxiliary space',
    commonPitfalls: [
      'Using `s.count(ch)` inside a loop: this turns an O(n) problem into O(n^2) and fails hidden stress tests.',
      'Iterating over the dictionary keys instead of the string in Python versions before 3.7 (though Python 3.7+ preserves insertion order in dicts, checking string directly is always safe).',
    ],
  },
  {
    id: 'code-3',
    title: 'Two Sum (Target Pair)',
    company: 'Cognizant',
    roleExam: 'Cognizant GenC Next',
    topic: 'Dictionaries & Sets',
    difficulty: 'Easy',
    frequency: 'Very High',
    description: `Given an array of integers \`nums\` and an integer \`target\`, find the 0-based indices of the two numbers such that they add up to \`target\`.

Assume that each input has exactly one solution, and you may not use the same element twice. Print the indices separated by a space in ascending order.`,
    constraints: [
      '2 <= len(nums) <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid answer exists',
    ],
    inputFormat: 'First line: target integer. Second line: space-separated integers.',
    outputFormat: 'Two space-separated indices, e.g. "0 1"',
    sampleCases: [
      {
        input: '9\n2 7 11 15',
        expectedOutput: '0 1',
        explanation: 'nums[0] + nums[1] == 2 + 7 == 9. Return "0 1".',
      },
      {
        input: '6\n3 2 4',
        expectedOutput: '1 2',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6. Return "1 2".',
      },
      {
        input: '6\n3 3',
        expectedOutput: '0 1',
        explanation: 'nums[0] + nums[1] == 3 + 3 == 6. Return "0 1".',
      },
    ],
    hiddenTestCases: [
      {
        name: 'Negative numbers',
        input: '0\n-3 4 3 90',
        expectedOutput: '0 2',
        isHidden: true,
      },
      {
        name: 'Large array distance',
        input: '100\n5 12 18 95 24',
        expectedOutput: '0 3',
        isHidden: true,
      },
    ],
    starterCode: `import sys

def two_sum(nums, target):
    # Target: O(n) time using a hash map
    seen = {}
    for idx, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return f"{seen[complement]} {idx}"
        seen[num] = idx
    return ""

if __name__ == '__main__':
    lines = sys.stdin.read().strip().split('\\n')
    if len(lines) >= 2:
        target = int(lines[0].strip())
        nums = list(map(int, lines[1].strip().split()))
        print(two_sum(nums, target))
`,
    solutionCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return f"{min(seen[diff], i)} {max(seen[diff], i)}"
        seen[num] = i
    return ""
`,
    intuition:
      'Instead of two nested loops checking every pair in O(n^2), maintain a hash map of `{number: index}` seen so far. For each number `x`, check if `(target - x)` already exists in the map in O(1) average time!',
    timeComplexity: 'O(n) - Single pass through nums',
    spaceComplexity: 'O(n) - Hash map storing at most n elements',
    commonPitfalls: [
      'Using double `for` loops (O(n^2)) fails when N=10^5.',
      'Storing elements before checking for complement: if `nums = [3, 2, 4]` and `target = 6`, putting `3` in `seen` first and then querying might reuse the same element index if not careful.',
    ],
  },
  {
    id: 'code-4',
    title: 'Reverse Words in a Sentence',
    company: 'Zoho',
    roleExam: 'Zoho Advanced Round 2',
    topic: 'Strings',
    difficulty: 'Easy',
    frequency: 'Top Repeated',
    description: `Given an input string \`s\`, reverse the order of the words.

A word is defined as a sequence of non-space characters. The words in \`s\` will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space, with leading, trailing, and multiple consecutive spaces between words removed.`,
    constraints: [
      '1 <= len(s) <= 10^4',
      's contains English letters (upper/lower), digits, and spaces',
      'There is at least one word in s',
    ],
    inputFormat: 'A single string, e.g. "  the sky  is blue  "',
    outputFormat: 'Single string with reversed words: "blue is sky the"',
    sampleCases: [
      {
        input: '  the sky  is blue  ',
        expectedOutput: 'blue is sky the',
        explanation: 'Leading/trailing and intermediate double spaces removed; words reversed.',
      },
      {
        input: 'hello world',
        expectedOutput: 'world hello',
        explanation: 'Simple two-word sentence reversed.',
      },
      {
        input: 'a good   example',
        expectedOutput: 'example good a',
        explanation: 'Multiple spaces between "good" and "example" reduced to single space.',
      },
    ],
    hiddenTestCases: [
      {
        name: 'Single word with spaces',
        input: '   python   ',
        expectedOutput: 'python',
        isHidden: true,
      },
      {
        name: 'Punctuation within words',
        input: 'Placement 2026: Ready!',
        expectedOutput: 'Ready! 2026: Placement',
        isHidden: true,
      },
    ],
    starterCode: `import sys

def reverse_words(s: str) -> str:
    # Python placement hack: s.split() automatically strips whitespace
    # and splits across multiple consecutive spaces!
    words = s.split()
    return " ".join(reversed(words))

if __name__ == '__main__':
    raw = sys.stdin.read().strip('\\r\\n')
    print(reverse_words(raw))
`,
    solutionCode: `def reverse_words(s: str) -> str:
    # In Python, str.split() with no argument treats consecutive whitespace
    # as a single delimiter and strips leading/trailing spaces.
    return " ".join(s.split()[::-1])
`,
    intuition:
      'Python\'s built-in `str.split()` without arguments is the ultimate placement superpower: it automatically collapses consecutive spaces, tabs, and newlines. Reversing the resulting list and joining with `" "` solves the problem in 1 line!',
    timeComplexity: 'O(n) - Single scan to tokenize and reverse',
    spaceComplexity: 'O(n) - List of parsed words',
    commonPitfalls: [
      'Using `s.split(" ")` with an explicit space argument: this preserves empty strings `""` for consecutive spaces, breaking test cases with multiple spaces!',
    ],
  },
  {
    id: 'code-5',
    title: 'Second Largest Element Without Sorting',
    company: 'Wipro',
    roleExam: 'Wipro NLTH / Elite',
    topic: 'Lists & Tuples',
    difficulty: 'Easy',
    frequency: 'High',
    description: `Given an array of integers \`arr\`, find the second largest distinct element in the array. If no distinct second largest element exists (e.g. all elements are equal or array size is 1), print \`-1\`.

Constraint: Do NOT sort the array! Placement interviewers explicitly test your ability to solve this in a single linear pass $O(n)$ with $O(1)$ space.`,
    constraints: [
      '1 <= len(arr) <= 10^5',
      '-10^9 <= arr[i] <= 10^9',
      'No sorting allowed (must be O(n))',
    ],
    inputFormat: 'Space-separated integers: "12 35 1 10 34 1"',
    outputFormat: 'Single integer representing the second largest distinct value: "34"',
    sampleCases: [
      {
        input: '12 35 1 10 34 1',
        expectedOutput: '34',
        explanation: 'Largest is 35, second largest distinct element is 34.',
      },
      {
        input: '10 10 10',
        expectedOutput: '-1',
        explanation: 'All elements are identical; no second largest exists.',
      },
      {
        input: '5',
        expectedOutput: '-1',
        explanation: 'Single element array; output -1.',
      },
    ],
    hiddenTestCases: [
      {
        name: 'Negative numbers',
        input: '-10 -40 -20 -1 -5',
        expectedOutput: '-5',
        isHidden: true,
      },
      {
        name: 'Duplicate largest values',
        input: '100 50 100 20',
        expectedOutput: '50',
        isHidden: true,
      },
    ],
    starterCode: `import sys

def second_largest(arr):
    # Single pass O(n) with 2 tracking variables
    first = second = float('-inf')
    
    for x in arr:
        if x > first:
            second = first
            first = x
        elif x > second and x != first:
            second = x
            
    return second if second != float('-inf') else -1

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if not raw:
        print("-1")
    else:
        nums = list(map(int, raw.split()))
        print(second_largest(nums))
`,
    solutionCode: `def second_largest(arr):
    first = float('-inf')
    second = float('-inf')
    
    for num in arr:
        if num > first:
            second = first
            first = num
        elif num > second and num != first:
            second = num
            
    return second if second != float('-inf') else -1
`,
    intuition:
      'Maintain two variables: `first` (largest) and `second` (second largest), initialized to `-infinity`. For each number `x`: if `x > first`, the previous largest becomes the second largest, and `first = x`. If `x` is between `first` and `second`, update `second = x`.',
    timeComplexity: 'O(n) - Exact 1 pass over array',
    spaceComplexity: 'O(1) - Only two float variables used',
    commonPitfalls: [
      'Sorting with `arr.sort()` gives O(n log n) and fails strict interviewer constraints.',
      'Initializing `first = 0` or `second = 0` fails when the input contains negative numbers (e.g. `[-10, -5]`). Always initialize to `-inf`!',
    ],
  },
  {
    id: 'code-6',
    title: 'Valid Anagram Check',
    company: 'Accenture',
    roleExam: 'Accenture Coding Assessment',
    topic: 'Strings',
    difficulty: 'Easy',
    frequency: 'Very High',
    description: `Given two strings \`s\` and \`t\`, print \`True\` if \`t\` is an anagram of \`s\`, and \`False\` otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.`,
    constraints: [
      '1 <= len(s), len(t) <= 5 * 10^4',
      'Strings consist of lowercase English letters',
    ],
    inputFormat: 'Two lines: first line string s, second line string t',
    outputFormat: '"True" or "False"',
    sampleCases: [
      {
        input: 'anagram\nnagaram',
        expectedOutput: 'True',
        explanation: 'Both contain 3 a\'s, 1 n, 1 g, 1 r, 1 m.',
      },
      {
        input: 'rat\ncar',
        expectedOutput: 'False',
        explanation: 'Characters do not match.',
      },
      {
        input: 'listen\nsilent',
        expectedOutput: 'True',
        explanation: 'Rearranging "listen" yields "silent".',
      },
    ],
    hiddenTestCases: [
      {
        name: 'Unequal lengths',
        input: 'ab\na',
        expectedOutput: 'False',
        isHidden: true,
      },
      {
        name: 'Duplicate character discrepancy',
        input: 'aacc\nccac',
        expectedOutput: 'False',
        isHidden: true,
      },
    ],
    starterCode: `import sys
from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    return Counter(s) == Counter(t)

if __name__ == '__main__':
    lines = sys.stdin.read().strip().split('\\n')
    if len(lines) >= 2:
        s = lines[0].strip()
        t = lines[1].strip()
        print(is_anagram(s, t))
`,
    solutionCode: `from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    return Counter(s) == Counter(t)
`,
    oneLinerAlternative: `return sorted(s) == sorted(t)  # O(n log n)`,
    intuition:
      'Two strings are anagrams if and only if they have the exact same length and character frequency counts. `collections.Counter(s) == collections.Counter(t)` checks this in $O(n)$ time!',
    timeComplexity: 'O(n) - Linear pass through both strings',
    spaceComplexity: 'O(1) - Constant auxiliary space for 26 English alphabet counts',
    commonPitfalls: [
      'Comparing `sorted(s) == sorted(t)` works, but takes O(n log n). Top tier campus interviews expect O(n) frequency hashing.',
    ],
  },
  {
    id: 'code-7',
    title: 'Missing Number in [1..N]',
    company: 'Capgemini',
    roleExam: 'Capgemini Exceller Test',
    topic: 'Recursion & Math',
    difficulty: 'Easy',
    frequency: 'High',
    description: `You are given an array of \`N-1\` distinct integers in the range \`[1, N]\`. Find the single number that is missing from the list.

Solve this in $O(N)$ time and $O(1)$ extra space.`,
    constraints: [
      '2 <= N <= 10^5',
      '1 <= arr[i] <= N',
      'Array elements are all distinct',
    ],
    inputFormat: 'First line: integer N. Second line: N-1 space-separated integers.',
    outputFormat: 'The missing integer',
    sampleCases: [
      {
        input: '5\n1 2 4 5',
        expectedOutput: '3',
        explanation: 'Numbers are from 1 to 5. 3 is missing.',
      },
      {
        input: '2\n1',
        expectedOutput: '2',
        explanation: 'Range is [1, 2]. 2 is missing.',
      },
      {
        input: '4\n2 3 4',
        expectedOutput: '1',
        explanation: '1 is missing.',
      },
    ],
    hiddenTestCases: [
      {
        name: 'Larger range missing middle',
        input: '8\n1 2 3 5 6 7 8',
        expectedOutput: '4',
        isHidden: true,
      },
      {
        name: 'Missing last number',
        input: '6\n1 2 3 4 5',
        expectedOutput: '6',
        isHidden: true,
      },
    ],
    starterCode: `import sys

def find_missing(n, arr):
    # Method 1: Math Gauss Sum = n * (n + 1) // 2
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(arr)
    return expected_sum - actual_sum

if __name__ == '__main__':
    lines = sys.stdin.read().strip().split('\\n')
    if len(lines) >= 2:
        n = int(lines[0].strip())
        arr = list(map(int, lines[1].strip().split()))
        print(find_missing(n, arr))
`,
    solutionCode: `def find_missing(n, arr):
    # XOR Approach (immune to arithmetic overflow in other languages):
    # xor of 1..n ^ xor of arr elements = missing number
    xor_all = 0
    for i in range(1, n + 1):
        xor_all ^= i
    for num in arr:
        xor_all ^= num
    return xor_all
`,
    intuition:
      'Method 1: Sum of numbers from 1 to N is $N(N+1)/2$. The missing number is `expected_sum - sum(arr)`. \nMethod 2: XOR trick! `a ^ a = 0` and `a ^ 0 = a`. XOR-ing 1..N with all array numbers cancels all pairs, leaving only the missing number!',
    timeComplexity: 'O(N) - Linear sum or XOR pass',
    spaceComplexity: 'O(1) - Constant auxiliary memory',
    commonPitfalls: [
      'Using `if i not in arr` in a loop: `in` on a list is O(N), making the overall algorithm O(N^2) TLE.',
    ],
  },
  {
    id: 'code-8',
    title: 'Longest Substring Without Repeating Characters',
    company: 'Amazon',
    roleExam: 'Amazon Junior SDE Campus Drive',
    topic: 'Strings',
    difficulty: 'Medium',
    frequency: 'Top Repeated',
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.

This is the quintessential Sliding Window interview question asked in almost every tier-1 and product company campus drive.`,
    constraints: [
      '0 <= len(s) <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces',
    ],
    inputFormat: 'A single line containing the string s',
    outputFormat: 'Single integer representing max length',
    sampleCases: [
      {
        input: 'abcabcbb',
        expectedOutput: '3',
        explanation: 'The answer is "abc", with length 3.',
      },
      {
        input: 'bbbbb',
        expectedOutput: '1',
        explanation: 'The answer is "b", with length 1.',
      },
      {
        input: 'pwwkew',
        expectedOutput: '3',
        explanation: 'The answer is "wke", with length 3. Note that "pwke" is a subsequence, not a substring.',
      },
    ],
    hiddenTestCases: [
      {
        name: 'Empty string',
        input: '',
        expectedOutput: '0',
        isHidden: true,
      },
      {
        name: 'All unique characters',
        input: 'abcdef',
        expectedOutput: '6',
        isHidden: true,
      },
      {
        name: 'Window jumping over previous match',
        input: 'abba',
        expectedOutput: '2',
        isHidden: true,
      },
    ],
    starterCode: `import sys

def length_of_longest_substring(s: str) -> int:
    # Sliding window with last seen dictionary
    last_seen = {}
    left = 0
    max_len = 0
    
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len

if __name__ == '__main__':
    raw = sys.stdin.read().strip('\\r\\n')
    print(length_of_longest_substring(raw))
`,
    solutionCode: `def length_of_longest_substring(s: str) -> int:
    char_index_map = {}
    left = 0
    max_length = 0

    for right, char in enumerate(s):
        # If character is seen inside current window, jump left pointer past it
        if char in char_index_map and char_index_map[char] >= left:
            left = char_index_map[char] + 1

        char_index_map[char] = right
        max_length = max(max_length, right - left + 1)

    return max_length
`,
    intuition:
      'Use a dynamic sliding window `[left, right]`. As `right` expands, record `{char: index}` in a hash map. When a duplicate `char` is encountered within `[left, right]`, leap `left` forward to `last_seen[char] + 1`. This avoids shrinking step-by-step and runs in a single O(n) pass!',
    timeComplexity: 'O(n) - Each character visited at most once by right pointer',
    spaceComplexity: 'O(min(n, m)) - Hash map storing alphabet/ASCII set characters',
    commonPitfalls: [
      'Forgetting `and char_index_map[char] >= left`: if a duplicate was seen BEFORE the current window start (e.g. in `"abba"` when encountering second `"a"`), jumping backwards would mistakenly expand the window!',
    ],
  },
];
