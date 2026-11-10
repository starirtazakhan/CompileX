CompileX

A Web-Based Compiler Construction and Analysis Platform
CompileX is an educational compiler platform that allows users to write programs in a custom programming language, execute individual compiler stages, inspect intermediate results, and execute supported programs through a web interface.

The project demonstrates the fundamental concepts of compiler construction while integrating modern full-stack web development technologies.
1. Overview
CompileX provides a browser-based environment for exploring the major phases of compiler construction.

Users can:
- Write programs using the custom CompileX language.
- Run individual compiler stages independently.
- Execute all compiler stages through the Run All feature.
- Inspect tokens, syntax trees, semantic results, symbol tables, and intermediate code.
- Execute programs using the integrated interpreter.
- Save and manage programs.
- Access the platform through an authenticated account.
- Track user activities through audit logs.
The application follows a three-layer architecture consisting of a React frontend, Node.js backend, and Python-based compiler engine.
2. Key Features
Compiler Features
- Lexical Analysis
- Syntax Analysis
- Semantic Analysis
- Intermediate Code Generation
- Program Execution through an Interpreter
- Independent execution of compiler stages
- Combined Run All functionality
- Error detection and reporting
- Symbol table generation
- Intermediate code visualization
Application Features
- User registration and login
- JWT-based authentication
- Role-based access control
- Program saving and management
- Audit logging
- Interactive code editor
- Compiler output visualization
- Dashboard and compiler workspace
3. Technology Stack
Component	Technologies
Frontend	React.js, Vite
Styling	Tailwind CSS
Code Editor	Monaco Editor
Icons	Lucide React
Backend	Node.js, Express.js
Compiler Engine	Python, FastAPI
Database	MongoDB
Authentication	JSON Web Tokens (JWT)
API Testing	Postman
Database Management	MongoDB Compass
Version Control	Git and GitHub


4. System Architecture
CompileX uses a multi-layer architecture in which each technology has a specific responsibility.

Frontend – React.js

Provides the user interface, code editor, dashboard, compiler workspace, and visualization of compiler results.

Backend – Node.js and Express.js

Handles authentication, authorization, program management, audit logs, and communication between the frontend and compiler engine.

Compiler Engine – Python and FastAPI

Implements the actual compiler logic, including lexical analysis, syntax analysis, semantic analysis, intermediate code generation, and program execution.

Database – MongoDB

Stores user accounts, saved programs, and audit logs.
Architecture Flow
             React Frontend
                   |
                   |
             Express Backend
                   |
          ---------------------
          |                   |
       MongoDB          Python FastAPI
                              |
                    ---------------------
                    |         |         |
                 Lexical   Syntax   Semantic
                 Analysis  Analysis  Analysis
                                        |
                                        |
                              Intermediate Code
                                  Generation
                                        |
                                        |
                                  Interpreter
                                        |
                                        |
                                  Program Output

5. Compiler Workflow
CompileX implements four primary compiler stages using Python.
5.1 Lexical Analysis
The lexical analyzer reads source code and converts it into a sequence of tokens.

It identifies:
- Keywords
- Identifiers
- Data types
- Operators
- Numeric literals
- String literals
- Punctuation and special symbols
It also detects invalid characters and lexical errors.
5.2 Syntax Analysis
The syntax analyzer checks whether the source code follows the grammar rules of the CompileX language.

It:
- Validates program structure.
- Checks statement syntax.
- Identifies missing semicolons and brackets.
- Generates an Abstract Syntax Tree (AST).
- Reports syntax errors.
5.3 Semantic Analysis
The semantic analyzer checks whether the program is logically meaningful according to the language rules.

It performs:
- Variable declaration checking.
- Duplicate declaration detection.
- Undeclared variable detection.
- Initialization checking.
- Data type compatibility checking.
- Expression validation.
- Symbol table generation.
5.4 Intermediate Code Generation
The Intermediate Code Generator converts validated source code into an intermediate representation.

It generates instructions that represent program operations in a simplified format, making the program easier to analyze.
5.5 Program Execution
CompileX also includes a Python-based interpreter that executes supported programs.

It handles:
- Variable declarations.
- Variable assignments.
- Arithmetic expressions.
- Conditional statements.
- Loops.
- Display/output statements.
Program execution is implemented separately from the four primary compiler stages.
6. CompileX Programming Language
CompileX uses a custom programming language designed for this project.
Keywords
Purpose	Keyword
Variable Declaration	define
Integer Data Type	whole
Decimal Data Type	decimal
String Data Type	text
Boolean Data Type	logic
Print / Output	display
If Condition	check
Else Condition	otherwise
Loop	repeat
Close Loop	finish


Operators
Operation	Operator
Assignment	<-
Addition	><
Subtraction	<>
Multiplication	><>
Division	</>
Greater Than	>>
Less Than	<<
Equal Comparison	===


Example Program
define whole age <- 20;
define decimal marks <- 85.5;
define text name <- "Irtaza";
define logic isActive <- true;

display("Welcome to CompileX");

check (age >> 18) {
    display("Eligible");
} otherwise {
    display("Not eligible");
}

define whole count <- 1;

repeat (count << 5) {
    display(count);
    count <- count >< 1;
} finish


7. Prerequisites
Before running CompileX, ensure that the following software is installed:
- Node.js and npm
- Python 3
- MongoDB Community Server
- Git
- Visual Studio Code
Recommended additional tools:
- MongoDB Compass
- Postman
8. Installation and Setup
Step 1: Clone the Repository
git clone <YOUR_GITHUB_REPOSITORY_URL>

Navigate to the project directory:
cd CompileX

Step 2: Setup the Compiler Engine
Navigate to the compiler engine directory:
cd compiler-engine

Create a Python virtual environment:
python -m venv venv

Activate the virtual environment on Windows:
venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Step 3: Setup the Backend
Open another terminal and navigate to the server directory:
cd server

Install dependencies:
npm install

Create a .env file inside the server directory.

Example configuration:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/CompileX
JWT_SECRET=your_secure_secret
COMPILER_ENGINE_URL=http://127.0.0.1:8000

Replace the example secret with a secure random value.

Important: Never upload .env files, passwords, database credentials, or API secrets to GitHub.
Step 4: Setup the Frontend
Open another terminal and navigate to the client directory:
cd client

Install dependencies:
npm install

Configure frontend environment variables if required by the project.
9. Running the Application
CompileX requires three application components to run simultaneously.
Terminal 1: Start Python Compiler Engine
Navigate to the compiler-engine directory and activate the virtual environment.

Run:
uvicorn main:app --reload --host 127.0.0.1 --port 8000

Compiler engine address:

http://127.0.0.1:8000

Health check:

http://127.0.0.1:8000/health
Terminal 2: Start Express Backend
Navigate to the server directory.

Run:
npm run dev

If the project does not have a development script, use the start command defined in package.json.
Terminal 3: Start React Frontend
Navigate to the client directory.

Run:
npm run dev

Open the frontend in your browser:

http://localhost:5173

Make sure MongoDB is running before starting the application.
10. Compiler API Endpoints
The Python FastAPI engine provides the following endpoints:
Method	Endpoint	Description
GET	/health	Checks compiler engine status
POST	/api/compiler/lexical	Performs lexical analysis
POST	/api/compiler/syntax	Performs syntax analysis
POST	/api/compiler/semantic	Performs semantic analysis
POST	/api/compiler/icg	Generates intermediate code
POST	/api/compiler/run-all	Executes the primary compiler stages sequentially
POST	/api/compiler/execute	Executes a program using the interpreter


Example Request
{
  "source_code": "define whole number <- 10; display(number);"
}

The Express backend provides additional application APIs for authentication, program management, audit logs, and communication with the compiler engine.
11. Database
CompileX uses MongoDB for persistent data storage.

The database is named:

CompileX

The application stores information related to:
- Users: Account information, credentials, and assigned roles.
- Programs: Saved source code and program ownership information.
- Audit Logs: Records of user activities and important application actions.
MongoDB Compass can be used to inspect database records.
12. Authentication and Authorization
CompileX implements JWT-based authentication and role-based access control.

The application supports three user roles:
Role	Description
ADMIN	Administrative access and management privileges
ANALYST	Authorized compiler and analysis operations
VIEWER	Restricted, read-oriented access


Backend middleware verifies authentication tokens and checks user permissions before allowing protected operations.

Audit logs provide activity tracking and help maintain accountability.
13. Troubleshooting
MongoDB Connection Error
- Make sure MongoDB Community Server is running.
- Verify the MongoDB connection string.
- Confirm that MongoDB is listening on port 27017.
Compiler Engine Connection Error
- Ensure the Python virtual environment is activated.
- Start the FastAPI server.
- Verify that port 8000 is available.
- Check the COMPILER_ENGINE_URL environment variable.
Frontend Connection Error
- Confirm that the Express backend is running.
- Verify the frontend API base URL.
- Check browser developer tools for errors.
Python Module Not Found
- Run commands from the compiler-engine directory.
- Activate the correct virtual environment.
- Install the required Python dependencies.
- Verify Python package imports and directory structure.
14. Project Objectives
The primary objectives of CompileX are:
1. Understand the fundamental concepts of compiler construction.
2. Implement the major compiler stages using Python.
3. Develop a custom programming language with defined grammar and syntax.
4. Integrate compiler functionality into a web-based application.
5. Implement authentication and role-based authorization.
6. Maintain user activity records through audit logging.
7. Demonstrate full-stack development and backend integration.
15. Future Improvements
Potential future enhancements include:
- Advanced grammar customization.
- More data types and operators.
- Enhanced syntax error recovery.
- Improved Abstract Syntax Tree visualization.
- Optimized intermediate code generation.
- Additional runtime features.
- Compiler performance analysis.
- Exporting compiler results.
- Support for additional programming constructs.
16. Academic Project Information
Project Name: CompileX
Project Category: Compiler Construction
Application Type: Web-Based Compiler Platform
Frontend: React.js
Backend: Node.js and Express.js
Compiler Engine: Python and FastAPI
Database: MongoDB  

CompileX is developed as an academic Compiler Construction project and demonstrates the integration of compiler theory with modern web development technologies.
CompileX — Write. Analyze. Understand.
