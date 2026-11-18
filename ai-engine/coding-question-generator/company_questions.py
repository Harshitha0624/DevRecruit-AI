COMPANY_QUESTION_BANK = {
    "general": [
        {
            "title": "Two Sum",
            "description": (
                "Given an array of integers and a target value, "
                "return the indices of two numbers whose sum equals the target."
            ),
            "skill": "Python",
            "difficulty": "Easy",
            "input_format": "An integer array and a target integer.",
            "output_format": "Return the indices of the two numbers.",
            "constraints": (
                "Exactly one valid solution exists. "
                "The same element cannot be used twice."
            ),
            "sample_input": "[2, 7, 11, 15], target = 9",
            "sample_output": "[0, 1]"
        },
        {
            "title": "Valid Parentheses",
            "description": (
                "Given a string containing brackets, determine whether "
                "the brackets are correctly balanced."
            ),
            "skill": "Python",
            "difficulty": "Easy",
            "input_format": "A string containing parentheses and brackets.",
            "output_format": "Return True if the brackets are valid, otherwise False.",
            "constraints": "The string contains only bracket characters.",
            "sample_input": "\"()[]{}\"",
            "sample_output": "True"
        },
        {
            "title": "Longest Substring Without Repeating Characters",
            "description": (
                "Given a string, find the length of the longest substring "
                "without repeating characters."
            ),
            "skill": "Python",
            "difficulty": "Medium",
            "input_format": "A string.",
            "output_format": "Return the maximum substring length.",
            "constraints": "The string may contain letters, digits, symbols, or spaces.",
            "sample_input": "\"abcabcbb\"",
            "sample_output": "3"
        },
        {
            "title": "Merge Intervals",
            "description": (
                "Given a collection of intervals, merge all overlapping intervals."
            ),
            "skill": "Python",
            "difficulty": "Medium",
            "input_format": "A list of integer intervals.",
            "output_format": "Return the merged intervals.",
            "constraints": "Intervals are represented as [start, end].",
            "sample_input": "[[1,3],[2,6],[8,10],[15,18]]",
            "sample_output": "[[1,6],[8,10],[15,18]]"
        },
        {
            "title": "Number of Islands",
            "description": (
                "Given a grid of land and water cells, determine the number "
                "of connected islands."
            ),
            "skill": "Python",
            "difficulty": "Hard",
            "input_format": "A two-dimensional grid containing '1' and '0'.",
            "output_format": "Return the number of islands.",
            "constraints": (
                "Adjacent land cells are connected horizontally or vertically."
            ),
            "sample_input": "[['1','1','0'],['1','0','0'],['0','0','1']]",
            "sample_output": "2"
        }
    ],
    "google": [
        {
            "title": "First Non-Repeating Character",
            "description": (
                "Find the first character in a string that does not repeat."
            ),
            "skill": "Python",
            "difficulty": "Easy",
            "input_format": "A string.",
            "output_format": "Return the first non-repeating character or -1.",
            "constraints": "The string may contain lowercase English letters.",
            "sample_input": "\"leetcode\"",
            "sample_output": "\"l\""
        }
    ],
    "microsoft": [
        {
            "title": "Reverse Linked List",
            "description": (
                "Given the head of a singly linked list, reverse the list."
            ),
            "skill": "Python",
            "difficulty": "Medium",
            "input_format": "A linked list of integers.",
            "output_format": "Return the head of the reversed linked list.",
            "constraints": "The list may contain zero or more nodes.",
            "sample_input": "[1,2,3,4,5]",
            "sample_output": "[5,4,3,2,1]"
        }
    ],
    "amazon": [
        {
            "title": "Maximum Subarray",
            "description": (
                "Find the contiguous subarray with the largest sum."
            ),
            "skill": "Python",
            "difficulty": "Medium",
            "input_format": "An integer array.",
            "output_format": "Return the maximum subarray sum.",
            "constraints": "The array contains at least one integer.",
            "sample_input": "[-2,1,-3,4,-1,2,1,-5,4]",
            "sample_output": "6"
        }
    ],
    "tcs": [
        {
            "title": "Count Vowels",
            "description": (
                "Count the number of vowels present in a given string."
            ),
            "skill": "Python",
            "difficulty": "Easy",
            "input_format": "A string.",
            "output_format": "Return the number of vowels.",
            "constraints": "Consider a, e, i, o, and u as vowels.",
            "sample_input": "\"developer\"",
            "sample_output": "4"
        }
    ],
    "infosys": [
        {
            "title": "Find Missing Number",
            "description": (
                "Given an array containing numbers from 0 to n with one "
                "number missing, find the missing number."
            ),
            "skill": "Python",
            "difficulty": "Easy",
            "input_format": "An integer array.",
            "output_format": "Return the missing integer.",
            "constraints": "All numbers are unique.",
            "sample_input": "[3,0,1]",
            "sample_output": "2"
        }
    ]
}


def get_company_questions(company):
    if not company:
        return COMPANY_QUESTION_BANK["general"]

    company_key = company.strip().lower()

    return COMPANY_QUESTION_BANK.get(
        company_key,
        COMPANY_QUESTION_BANK["general"]
    )