
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.learning_resource import LearningResource
from app.models.learning_course import LearningModule, LearningLesson


# ============================================================
# DATABASE
# ============================================================

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not configured")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ============================================================
# REAL EXTERNAL COURSES
# ============================================================

COURSES = [
    {
        "title": "CS50's Introduction to Programming with Python",
        "description": (
            "Harvard's beginner-friendly Python course. "
            "The OpenCourseWare version is free. A verified "
            "edX certificate is optional and paid. Check the "
            "provider for current certificate pricing."
        ),
        "category": "Learn by Skill",
        "subcategory": "Programming",
        "skill": "Python",
        "level": "Beginner",
        "difficulty": "Easy",
        "resource_type": "Course",
        "platform": "Harvard CS50",
        "access_type": "Free; optional paid certificate",
        "url": "https://cs50.harvard.edu/python/",
        "duration": "10 weeks"
    },
    {
        "title": "HarvardX CS50 Python - edX",
        "description": (
            "The official edX version of Harvard's CS50 Python "
            "course. Audit access is available; a verified "
            "certificate requires payment. Check edX for "
            "current enrollment and pricing."
        ),
        "category": "Learn by Skill",
        "subcategory": "Programming",
        "skill": "Python",
        "level": "Beginner",
        "difficulty": "Easy",
        "resource_type": "Course",
        "platform": "edX",
        "access_type": "Free audit; paid verified certificate",
        "url": (
            "https://www.edx.org/learn/python/"
            "harvard-university-cs50-s-introduction-to-programming-with-python"
        ),
        "duration": "10 weeks"
    },
    {
        "title": "100 Days of Code - The Complete Python Pro Bootcamp",
        "description": (
            "Udemy course by Dr. Angela Yu covering Python "
            "through practical projects. Paid course; price "
            "and promotional offers vary by region and date. "
            "Includes a Udemy certificate of completion."
        ),
        "category": "Learn by Skill",
        "subcategory": "Programming",
        "skill": "Python",
        "level": "Beginner",
        "difficulty": "Medium",
        "resource_type": "Course",
        "platform": "Udemy",
        "access_type": "Paid; price varies",
        "url": "https://www.udemy.com/course/100-days-of-code/",
        "duration": "Approximately 56 hours"
    },
    {
        "title": "Machine Learning Specialization",
        "description": (
            "Machine Learning Specialization by DeepLearning.AI "
            "and Stanford Online on Coursera. Subscription or "
            "payment may be required for graded work and the "
            "certificate. Check the current enrollment options."
        ),
        "category": "Learn by Skill",
        "subcategory": "Artificial Intelligence",
        "skill": "Machine Learning",
        "level": "Intermediate",
        "difficulty": "Medium",
        "resource_type": "Course",
        "platform": "Coursera",
        "access_type": "Paid; check audit and subscription options",
        "url": (
            "https://www.coursera.org/specializations/"
            "machine-learning-introduction"
        ),
        "duration": "Approximately 3 months"
    },
    {
        "title": "Python Programming MOOC",
        "description": (
            "University of Helsinki Python Programming MOOC. "
            "A structured programming course with practical "
            "exercises. Check the official site for the current "
            "course edition, enrollment dates and certificate rules."
        ),
        "category": "Learn by Skill",
        "subcategory": "Programming",
        "skill": "Python",
        "level": "Beginner",
        "difficulty": "Medium",
        "resource_type": "Course",
        "platform": "University of Helsinki",
        "access_type": "Free",
        "url": "https://programming-26.mooc.fi/",
        "duration": "Self-paced"
    }
]


# ============================================================
# ORIGINAL DEVRECRUIT LEARNING CONTENT
# ============================================================

PYTHON_MODULES = [
    {
        "title": "Python Fundamentals",
        "description": "Understand the basic building blocks of Python.",
        "lessons": [
            {
                "title": "Introduction to Python and Variables",
                "content": """
<h2>Introduction to Python</h2>
<p>Python is a high-level programming language used in web
development, automation, data science and artificial intelligence.</p>

<h3>Variables</h3>
<p>A variable stores a value that can be used later in a program.</p>

<pre>
name = "Harshitha"
age = 22
percentage = 85.5

print(name)
print(age)
</pre>

<h3>Common data types</h3>
<ul>
<li>int: whole numbers</li>
<li>float: decimal numbers</li>
<li>str: text</li>
<li>bool: True or False</li>
</ul>

<h3>Practice</h3>
<p>Create variables for your name, college, branch and CGPA.
Print all four values.</p>
""",
                "duration_minutes": 15
            },
            {
                "title": "Operators and User Input",
                "content": """
<h2>Operators in Python</h2>
<p>Operators perform calculations and comparisons.</p>

<pre>
a = 10
b = 5

print(a + b)
print(a - b)
print(a * b)
print(a / b)
print(a % b)
</pre>

<h3>Taking user input</h3>
<pre>
name = input("Enter your name: ")
print("Welcome", name)
</pre>

<p>The input() function receives text from the user.
Use int() or float() when numerical input is required.</p>

<h3>Practice</h3>
<p>Write a program that accepts two numbers and displays
their sum, difference and product.</p>
""",
                "duration_minutes": 15
            }
        ]
    },
    {
        "title": "Conditions, Loops and Functions",
        "description": "Build program logic using decisions and repetition.",
        "lessons": [
            {
                "title": "Conditional Statements",
                "content": """
<h2>Conditional Statements</h2>
<p>Conditions allow a program to make decisions.</p>

<pre>
marks = 75

if marks >= 85:
    print("Excellent")
elif marks >= 60:
    print("Good")
else:
    print("Needs improvement")
</pre>

<p>Python uses if, elif and else to execute different
blocks depending on a condition.</p>

<h3>Practice</h3>
<p>Write a program to check whether a number is positive,
negative or zero.</p>
""",
                "duration_minutes": 15
            },
            {
                "title": "Loops and Functions",
                "content": """
<h2>Loops</h2>
<p>Loops repeat a block of code.</p>

<pre>
for number in range(1, 6):
    print(number)
</pre>

<h3>While loop</h3>
<pre>
count = 1

while count <= 5:
    print(count)
    count += 1
</pre>

<h3>Functions</h3>
<p>Functions are reusable blocks of code.</p>

<pre>
def add(a, b):
    return a + b

result = add(10, 20)
print(result)
</pre>

<h3>Practice</h3>
<p>Create a function that accepts a number and returns
its factorial.</p>
""",
                "duration_minutes": 20
            }
        ]
    },
    {
        "title": "Collections, Files and Error Handling",
        "description": "Work with Python data structures and files.",
        "lessons": [
            {
                "title": "Lists, Tuples and Dictionaries",
                "content": """
<h2>Python Collections</h2>

<h3>List</h3>
<pre>
skills = ["Python", "SQL", "Java"]
skills.append("FastAPI")
print(skills)
</pre>

<h3>Tuple</h3>
<pre>
coordinates = (10, 20)
print(coordinates[0])
</pre>

<h3>Dictionary</h3>
<pre>
student = {
    "name": "Ananya",
    "branch": "Computer Science"
}

print(student["name"])
</pre>

<h3>Practice</h3>
<p>Create a dictionary containing a student's name,
USN and branch. Print each value.</p>
""",
                "duration_minutes": 20
            },
            {
                "title": "File Handling and Exceptions",
                "content": """
<h2>File Handling</h2>
<p>Python can read and write files using open().</p>

<pre>
with open("notes.txt", "w") as file:
    file.write("Learning Python")

with open("notes.txt", "r") as file:
    print(file.read())
</pre>

<h3>Exception Handling</h3>
<p>Use try and except to handle errors safely.</p>

<pre>
try:
    number = int(input("Enter a number: "))
    print(100 / number)
except ValueError:
    print("Enter a valid number")
except ZeroDivisionError:
    print("Cannot divide by zero")
</pre>

<h3>Practice</h3>
<p>Write a program that accepts a number and handles
invalid input without crashing.</p>
""",
                "duration_minutes": 20
            }
        ]
    }
]


# ============================================================
# INSERT OR UPDATE COURSE WITHOUT DUPLICATES
# ============================================================

def upsert_resource(db, item):
    resource = (
        db.query(LearningResource)
        .filter(LearningResource.title == item["title"])
        .first()
    )

    if resource is None:
        resource = LearningResource(**item)
        db.add(resource)
        db.flush()
        print("Added course:", item["title"])
    else:
        for key, value in item.items():
            setattr(resource, key, value)

        db.flush()
        print("Updated course:", item["title"])

    return resource


# ============================================================
# INSERT OR UPDATE MODULES AND LESSONS
# ============================================================

def seed_python_lessons(db, resource):
    for module_index, module_data in enumerate(PYTHON_MODULES, start=1):

        module = (
            db.query(LearningModule)
            .filter(
                LearningModule.resource_id == resource.id,
                LearningModule.title == module_data["title"]
            )
            .first()
        )

        if module is None:
            module = LearningModule(
                resource_id=resource.id,
                title=module_data["title"],
                description=module_data["description"],
                sort_order=module_index,
                is_active=True
            )
            db.add(module)
            db.flush()
        else:
            module.description = module_data["description"]
            module.sort_order = module_index
            module.is_active = True

        for lesson_index, lesson_data in enumerate(
            module_data["lessons"], start=1
        ):
            lesson = (
                db.query(LearningLesson)
                .filter(
                    LearningLesson.module_id == module.id,
                    LearningLesson.title == lesson_data["title"]
                )
                .first()
            )

            if lesson is None:
                lesson = LearningLesson(
                    module_id=module.id,
                    title=lesson_data["title"],
                    content_type="text",
                    content=lesson_data["content"],
                    duration_minutes=lesson_data["duration_minutes"],
                    sort_order=lesson_index,
                    is_active=True
                )
                db.add(lesson)
            else:
                lesson.content_type = "text"
                lesson.content = lesson_data["content"]
                lesson.duration_minutes = lesson_data["duration_minutes"]
                lesson.sort_order = lesson_index
                lesson.is_active = True

    db.flush()


# ============================================================
# MAIN SEED FUNCTION
# ============================================================

def seed():
    db = SessionLocal()

    try:
        seeded_count = 0

        for course_data in COURSES:
            resource = upsert_resource(db, course_data)

            # Add DevRecruit AI's original in-app lessons only to
            # the selected course. External Python courses keep their
            # own provider content and links.
            if resource.title == "CS50's Introduction to Programming with Python":
                seed_python_lessons(db, resource)

            seeded_count += 1

        db.commit()

        print("\nLearning Hub seeding completed.")
        print("Courses added or updated:", seeded_count)
        print("Existing unrelated resources were preserved.")
        print("Original Python modules and lessons are available.")
        print("No candidate progress or completion records were created.")

    except Exception as error:
        db.rollback()
        print("Seeding failed:", str(error))
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()
