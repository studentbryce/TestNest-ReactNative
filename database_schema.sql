-- Complete Database Schema for TestNest MCQ Application
-- Role-based authentication with students and tutors
-- Integer-based answer system (1-4 for choices)

-- Users table with role-based support
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY, -- Auto-incrementing primary key for all users
    StudentID INTEGER UNIQUE CHECK (StudentID >= 1000000 AND StudentID <= 99999999), -- 7-8 digit constraint, required for students only
    FirstName VARCHAR(256) NOT NULL,
    LastName VARCHAR(256) NOT NULL,
    UserName VARCHAR(256) UNIQUE NOT NULL,
    Password VARCHAR(64) NOT NULL, -- SHA256 HASH
    Role VARCHAR(20) DEFAULT 'student' CHECK (Role IN ('student', 'tutor')),
    TutorID VARCHAR(10) UNIQUE, -- For tutors only, format: TUT1234
    Department VARCHAR(100), -- For tutors only
    -- Constraint: Students must have StudentID, tutors must have TutorID
    CONSTRAINT check_role_requirements CHECK (
        (Role = 'student' AND StudentID IS NOT NULL AND TutorID IS NULL) OR
        (Role = 'tutor' AND TutorID IS NOT NULL)
    )
);

-- Questions table with integer answers
CREATE TABLE Questions (
    QuestionID SERIAL PRIMARY KEY,
    Question TEXT NOT NULL,
    Choice1 VARCHAR(256) NOT NULL,
    Choice2 VARCHAR(256) NOT NULL,
    Choice3 VARCHAR(256),
    Choice4 VARCHAR(256),
    Answer INTEGER NOT NULL CHECK (Answer >= 1 AND Answer <= 4) -- 1=Choice1, 2=Choice2, 3=Choice3, 4=Choice4
);

-- Tests table
CREATE TABLE Tests (
    TestID SERIAL PRIMARY KEY,
    TestTitle VARCHAR(256) NOT NULL,
    TimeLimit INTEGER NOT NULL,
    TestDescription TEXT
);

-- TestQuestions junction table
CREATE TABLE TestQuestions (
    TestID INTEGER,
    QuestionID INTEGER,
    PRIMARY KEY (TestID, QuestionID),
    FOREIGN KEY (TestID) REFERENCES Tests(TestID) ON DELETE CASCADE, -- if test is deleted, delete questions from one-to-many table
    FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID) ON DELETE CASCADE -- if question is deleted, delete from TestQuestions table
);

-- Results table with integer answers
CREATE TABLE Results (
    ResultID SERIAL PRIMARY KEY,
    StudentID INTEGER NOT NULL CHECK (StudentID >= 1000000 AND StudentID <= 99999999), -- 7-8 digit constraint
    TestID INTEGER NOT NULL,
    QuestionID INTEGER NOT NULL,
    GivenAnswer INTEGER NOT NULL CHECK (GivenAnswer >= 1 AND GivenAnswer <= 4), -- 1=Choice1, 2=Choice2, 3=Choice3, 4=Choice4
    created_at TIMESTAMPTZ DEFAULT ((NOW() AT TIME ZONE 'Pacific/Auckland') AT TIME ZONE 'UTC'), -- Store correct UTC time
    FOREIGN KEY (StudentID) REFERENCES Users(StudentID) ON DELETE CASCADE, -- if user is deleted, delete results
    FOREIGN KEY (TestID) REFERENCES Tests(TestID) ON DELETE CASCADE, -- if test is deleted, delete results
    FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID) ON DELETE CASCADE -- if question is deleted, delete results
);

-- Add indexes for better performance
CREATE INDEX idx_users_username ON Users(UserName);
CREATE INDEX idx_users_studentid ON Users(StudentID);
CREATE INDEX idx_users_tutorid ON Users(TutorID);
CREATE INDEX idx_users_role ON Users(Role);
CREATE INDEX idx_results_student ON Results(StudentID);
CREATE INDEX idx_results_test ON Results(TestID);
CREATE INDEX idx_testquestions_test ON TestQuestions(TestID);
CREATE INDEX idx_testquestions_question ON TestQuestions(QuestionID);

-- Sample data with corrected integer answers
-- Insert into Users table (students and tutors)
INSERT INTO Users (StudentID, FirstName, LastName, UserName, Password, Role) VALUES 
(12345678, 'Automation', 'Test', 'autotest', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'student'),
(9913033, 'Bryce', 'Milbank', 'brycerm', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'student'),
(10013661, 'Peter', 'Kim', 'peterrabbit', '6385338e394435c52c9dcc79a437cef85b3b55baf7d7793d3b4e1d73cbacfd8b', 'student'),
(10005332, 'Avneet', 'Singh', 'avneet55', 'd2483e12bdeb1c7b3c02ceea638fa4f1931b2cd9aad058d2d36ec3bb3671f791', 'student');

-- Add sample tutors (UserID will be auto-generated, StudentID is NULL for tutors)
INSERT INTO Users (FirstName, LastName, UserName, Password, Role, TutorID, Department) VALUES 
('Dr. Sarah', 'Johnson', 'sarah.johnson@university.edu', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'tutor', 'TUT1001', 'Computer Science'),
('Prof. Michael', 'Chen', 'michael.chen@university.edu', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'tutor', 'TUT1002', 'Mathematics'),
('Dr. Emily', 'Davis', 'emily.davis@university.edu', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'tutor', 'TUT1003', 'Computer Science');

-- Insert into Questions table (Answer column uses integers 1-4)
INSERT INTO Questions (Question, Choice1, Choice2, Choice3, Choice4, Answer) VALUES 
('Which of the following is a mutable data type in Python?', 'int', 'float', 'list', 'tuple', 3),
('What is the data type of ''True'' in Python?', 'int', 'bool', 'str', 'float', 2),
('Which of these is not a standard Python data type?', 'dictionary', 'matrix', 'set', 'string', 2),
('What does the following code output? print(type(10.0))', 'int', 'float', 'double', 'complex', 2),
('In Python, what is the result of type(''3'') == type(3)?', 'True', 'False', 'None', 'Error', 2),
('Which data type is best for storing the number of items in stock?', 'int', 'float', 'str', 'bool', 1),
('How would you correctly declare a variable named total_cost with an initial integer value of 500?', 'int total_cost = 500', 'var total_cost = 500', 'total_cost = 500', 'int: total_cost = 500', 3),
('Which of these is an immutable data type in Python?', 'list', 'set', 'tuple', 'dictionary', 3),
('If you wanted to represent a person''s age, which data type would be most appropriate?', 'int', 'str', 'list', 'bool', 1),
('What is the correct way to assign the string "Hello" to a variable called greeting?', 'greeting = Hello', 'greeting = "Hello"', 'greeting := "Hello"', 'greeting == "Hello"', 2),
('What will be the output of the following code? print(type([1, 2, 3]))', 'list', 'array', 'tuple', 'dict', 1),
('Which of the following can be used to create a floating-point number in Python?', 'float(3.14)', 'float("3.14")', '3.14', 'All of the above', 4),
('Which function can you use to get the length of a list, string, or tuple in Python?', 'size()', 'count()', 'length()', 'len()', 4),
('What will be the result of type(10 + 5.5) in Python?', 'int', 'float', 'complex', 'str', 2),
('Which statement is correct regarding Python variables?', 'Python variables need to be declared with a specific data type.', 'Python variables cannot change types after they are assigned.', 'Python variables can change types dynamically.', 'Python variables must be initialized before use.', 3);

-- Insert into Tests table
INSERT INTO Tests (TestTitle, TimeLimit, TestDescription) VALUES 
('Python Data Types and Variables', 15, 'Basic data types ( ints and floats, other numbers, Booleans, strings, bytes) Basic Data Structures (lists, tuples, sets, dictionaries, list comprehensions, dictionary comprehensions)'),
('Python Control Flow and Functions', 20, 'Control Flow ( if else, while, for ) Functions (anatomy, variables and scope, functions as variables)'),
('Python Classes and Objects', 20, 'Classes and Objects (anatomy, static and instance methods, inheritance)');

-- Insert into TestQuestions table
INSERT INTO TestQuestions (TestID, QuestionID) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14), (1, 15);

-- Insert into Results table (GivenAnswer uses integers 1-4)
INSERT INTO Results (StudentID, TestID, QuestionID, GivenAnswer) VALUES 
(9913033, 1, 1, 3),  -- 'list' is choice 3 (correct)
(9913033, 1, 2, 2),  -- 'bool' is choice 2 (correct)
(9913033, 1, 3, 2),  -- 'matrix' is choice 2 (correct)
(9913033, 1, 4, 2),  -- 'float' is choice 2 (correct)
(9913033, 1, 5, 2),  -- 'False' is choice 2 (correct)
(9913033, 1, 6, 1),  -- 'int' is choice 1 (correct)
(9913033, 1, 7, 3),  -- 'total_cost = 500' is choice 3 (correct)
(9913033, 1, 8, 3),  -- 'tuple' is choice 3 (correct)
(9913033, 1, 9, 1),  -- 'int' is choice 1 (correct)
(9913033, 1, 10, 1), -- 'greeting = Hello' is choice 1 (incorrect - should be 2)
(9913033, 1, 11, 1), -- 'list' is choice 1 (correct)
(9913033, 1, 12, 4), -- 'All of the above' is choice 4 (correct)
(9913033, 1, 13, 4), -- 'len()' is choice 4 (correct)
(9913033, 1, 14, 2), -- 'float' is choice 2 (correct)
(9913033, 1, 15, 3); -- 'Python variables can change types dynamically.' is choice 3 (correct)

-- Schema Notes:
-- 1. UserID is the primary key for all users (auto-incrementing)
-- 2. StudentID is required for students only, NULL for tutors
-- 3. TutorID is required for tutors only, NULL for students
-- 4. Results table still references StudentID (only students take tests)
-- 5. Role-based constraints ensure proper data integrity

-- This design allows:
-- - Students: Have both UserID (PK) and StudentID (for results tracking)
-- - Tutors: Have UserID (PK) and TutorID, but no StudentID
-- - Proper foreign key relationships for results (students only)
-- - Clean separation of concerns between authentication (UserID) and business logic (StudentID/TutorID)