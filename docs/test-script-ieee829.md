# TestNest Application - Test Script Document
**Document ID:** TS-TESTNEST-001  
**Version:** 1.0  
**Date:** October 31, 2025  
**Prepared By:** TestNest Development Team  
**Reviewed By:** Quality Assurance Team  

---

## 1. INTRODUCTION

### 1.1 Purpose
This document provides comprehensive test scripts for validating the functionality, state transitions, and usability of the TestNest mobile application according to IEEE 829 standards.

### 1.2 Scope
Testing covers all major application functions including:
- User authentication and authorization
- Test management and execution
- Results processing and storage
- Navigation and user interface
- Data persistence and synchronization

### 1.3 References
- IEEE Std 829-2008: Standard for Software and System Test Documentation
- TestNest State Transition Diagram (state-diagram.puml)
- TestNest Application Requirements Specification

---

## 2. TEST ENVIRONMENT SETUP

### 2.1 Hardware Requirements
- **Mobile Device:** Android 7.0+ or iOS 12.0+
- **RAM:** Minimum 2GB
- **Storage:** Minimum 500MB available space
- **Network:** WiFi or cellular data connection

### 2.2 Software Requirements
- **TestNest Application:** Version 1.0+
- **Database:** Supabase PostgreSQL
- **Testing Account:** autotest user (ID: 12345678)

### 2.3 Test Data
- Valid student accounts with known credentials
- Sample test questions and correct answers
- Pre-configured test scenarios

---

## 3. TEST EXECUTION PROCEDURES

## Test Case TC001: User Registration
**Priority:** High  
**Type:** Functional  
**Prerequisites:** Application installed, network connectivity

### Test Steps:
1. **Launch Application**
   - Expected: Application loads to Home Screen
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

2. **Navigate to Registration**
   - Action: Open drawer → Select "Register"
   - Expected: Registration form displayed
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

3. **Enter Valid Registration Data**
   - Student ID: 87654321
   - First Name: Test
   - Last Name: User
   - Username: testuser001
   - Password: SecurePass123!
   - Expected: All fields accept input, validation passes
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

4. **Submit Registration**
   - Action: Tap "Register" button
   - Expected: Registration successful, navigate to Dashboard
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

**Overall Result:** ☐ Pass ☐ Fail  
**Comments:** _______________

---

## Test Case TC002: User Authentication
**Priority:** High  
**Type:** Functional  
**Prerequisites:** Valid user account exists

### Test Steps:
1. **Navigate to Login Screen**
   - Action: Open drawer → Select "Login"
   - Expected: Login form displayed
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

2. **Enter Valid Credentials**
   - Username/StudentID: autotest
   - Password: [known password]
   - Expected: Fields accept input
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

3. **Submit Login**
   - Action: Tap "Login" button
   - Expected: Authentication successful, navigate to Dashboard
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

4. **Verify Authenticated State**
   - Action: Check drawer menu options
   - Expected: Authenticated options visible (Dashboard, Tests, Profile)
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

**Overall Result:** ☐ Pass ☐ Fail  
**Comments:** _______________

---

## Test Case TC003: Test Execution Workflow
**Priority:** High  
**Type:** Functional  
**Prerequisites:** User logged in, tests available

### Test Steps:
1. **Access Test List**
   - Action: Navigate to "Test List" from drawer
   - Expected: Available tests displayed
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

2. **Select Test**
   - Action: Tap on a test from the list
   - Expected: Test details displayed, "Start Test" button available
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

3. **Start Test**
   - Action: Tap "Start Test" button
   - Expected: First question displayed, timer starts
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

4. **Answer Questions**
   - Action: Select answers for all questions
   - Expected: Answers recorded, navigation works
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

5. **Submit Test**
   - Action: Tap "Submit Test" button
   - Expected: Test submitted, results calculated
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

6. **View Results**
   - Action: Review test results
   - Expected: Score, correct/incorrect answers, timestamp displayed
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

**Overall Result:** ☐ Pass ☐ Fail  
**Comments:** _______________

---

## Test Case TC004: Demo Test Functionality
**Priority:** Medium  
**Type:** Functional  
**Prerequisites:** Application accessible without login

### Test Steps:
1. **Access Demo Test**
   - Action: Tap "Take Demo Test" on Home screen
   - Expected: Demo test questions loaded
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

2. **Complete Demo Test**
   - Action: Answer all demo questions
   - Expected: All questions answered successfully
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

3. **View Demo Results**
   - Action: Submit demo and view results
   - Expected: Results displayed without database storage
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

**Overall Result:** ☐ Pass ☐ Fail  
**Comments:** _______________

---

## Test Case TC005: Timer Functionality
**Priority:** High  
**Type:** Functional  
**Prerequisites:** Test in progress

### Test Steps:
1. **Verify Timer Display**
   - Action: Start a test with time limit
   - Expected: Timer countdown displayed
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

2. **Test Timer Pause/Resume**
   - Action: Pause and resume timer
   - Expected: Timer pauses and resumes correctly
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

3. **Test Auto-Submit**
   - Action: Allow timer to reach zero
   - Expected: Test auto-submits when time expires
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

**Overall Result:** ☐ Pass ☐ Fail  
**Comments:** _______________

---

## Test Case TC006: Navigation State Transitions
**Priority:** Medium  
**Type:** UI/UX  
**Prerequisites:** Application running

### Test Steps:
1. **Drawer Navigation**
   - Action: Open/close drawer menu
   - Expected: Smooth transition, all menu items accessible
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

2. **Screen Transitions**
   - Action: Navigate between different screens
   - Expected: Proper back navigation, state preservation
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

3. **Authentication State Changes**
   - Action: Login/logout and verify menu changes
   - Expected: Menu items show/hide based on authentication
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

**Overall Result:** ☐ Pass ☐ Fail  
**Comments:** _______________

---

## Test Case TC007: Data Persistence
**Priority:** High  
**Type:** Functional  
**Prerequisites:** User logged in, network connectivity

### Test Steps:
1. **Test Results Storage**
   - Action: Complete and submit a test
   - Expected: Results stored in database
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

2. **Results Retrieval**
   - Action: Navigate to Results screen
   - Expected: Previously completed tests displayed
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

3. **Session Persistence**
   - Action: Close and reopen application
   - Expected: User remains logged in
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

**Overall Result:** ☐ Pass ☐ Fail  
**Comments:** _______________

---

## Test Case TC008: Error Handling
**Priority:** Medium  
**Type:** Negative Testing  
**Prerequisites:** Application running

### Test Steps:
1. **Network Disconnection**
   - Action: Disconnect network during test
   - Expected: Graceful error handling, user notification
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

2. **Invalid Login Credentials**
   - Action: Enter incorrect username/password
   - Expected: Clear error message, no application crash
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

3. **Database Connection Issues**
   - Action: Simulate database unavailability
   - Expected: Appropriate error messages, fallback behavior
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

**Overall Result:** ☐ Pass ☐ Fail  
**Comments:** _______________

---

## Test Case TC009: Unit Test Execution (AutoTest User Only)
**Priority:** Medium  
**Type:** System Testing  
**Prerequisites:** Logged in as autotest user

### Test Steps:
1. **Access Unit Tests**
   - Action: Login as autotest, check drawer menu
   - Expected: "Unit Tests" option visible
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

2. **Execute Test Suite**
   - Action: Navigate to Unit Tests → Run All Tests
   - Expected: All unit tests execute successfully
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

3. **Verify Test Results**
   - Action: Review unit test results
   - Expected: Comprehensive test coverage, pass/fail status
   - Actual: _______________
   - Result: ☐ Pass ☐ Fail

**Overall Result:** ☐ Pass ☐ Fail  
**Comments:** _______________

---

## 4. TEST EXECUTION SUMMARY

### 4.1 Test Results Summary
| Test Case ID | Test Case Name | Priority | Result | Comments |
|--------------|----------------|----------|--------|----------|
| TC001 | User Registration | High | ☐ Pass ☐ Fail | |
| TC002 | User Authentication | High | ☐ Pass ☐ Fail | |
| TC003 | Test Execution Workflow | High | ☐ Pass ☐ Fail | |
| TC004 | Demo Test Functionality | Medium | ☐ Pass ☐ Fail | |
| TC005 | Timer Functionality | High | ☐ Pass ☐ Fail | |
| TC006 | Navigation State Transitions | Medium | ☐ Pass ☐ Fail | |
| TC007 | Data Persistence | High | ☐ Pass ☐ Fail | |
| TC008 | Error Handling | Medium | ☐ Pass ☐ Fail | |
| TC009 | Unit Test Execution | Medium | ☐ Pass ☐ Fail | |

### 4.2 Overall Assessment
- **Total Test Cases:** 9
- **Passed:** ___/9
- **Failed:** ___/9
- **Pass Rate:** ___%

### 4.3 Defects Identified
| Defect ID | Description | Severity | Status |
|-----------|-------------|----------|--------|
| | | | |
| | | | |

### 4.4 Recommendations
- [ ] All critical functionality verified
- [ ] Performance within acceptable limits
- [ ] User interface intuitive and responsive
- [ ] Error handling adequate
- [ ] Ready for production deployment

---

**Test Execution Date:** _______________  
**Tester Name:** _______________  
**Tester Signature:** _______________  

**Review Date:** _______________  
**Reviewer Name:** _______________  
**Reviewer Signature:** _______________