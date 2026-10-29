const fs = require('fs');
const path = require('path');

// 1. MERN Stack pool (50 questions)
const mernQuestions = [
  {
    questionText: 'Which MongoDB aggregation pipeline stage is used to filter documents in a collection?',
    options: ['$group', '$project', '$match', '$filter'],
    correctOption: 2,
    explanation: '$match filters the documents to pass only those matching criteria to the next stage.',
    marks: 10
  },
  {
    questionText: 'In Express.js, what does the next() function do inside custom middleware?',
    options: [
      'Terminates the current HTTP request',
      'Passes control to the next middleware or route handler in the stack',
      'Restarts the Express application',
      'Redirects the client to another URL'
    ],
    correctOption: 1,
    explanation: 'Calling next() hands off execution to the subsequent middleware function in the stack.',
    marks: 10
  },
  {
    questionText: 'In React, what is the purpose of the cleanup function returned inside useEffect?',
    options: [
      'To clear browser LocalStorage',
      'To reset component state to initial values',
      'To clean up subscriptions, timers, or event listeners before unmount or re-running effect',
      'To trigger an immediate re-render'
    ],
    correctOption: 2,
    explanation: 'The return function cleans up timers, listeners, or aborts ongoing fetch requests.',
    marks: 10
  },
  {
    questionText: 'Which Node.js core module is primarily responsible for handling file system operations?',
    options: ['path', 'fs', 'http', 'events'],
    correctOption: 1,
    explanation: 'The "fs" module provides both synchronous and asynchronous file system operations.',
    marks: 10
  },
  {
    questionText: 'What is the primary difference between SQL databases and MongoDB?',
    options: [
      'SQL is NoSQL and MongoDB is relational',
      'SQL uses tables with rigid schemas; MongoDB is document-oriented with flexible BSON schemas',
      'MongoDB does not support indexes',
      'SQL databases cannot store numbers'
    ],
    correctOption: 1,
    explanation: 'MongoDB stores records as dynamic BSON documents without rigid schema constraints.',
    marks: 10
  },
  {
    questionText: 'In React, why must hooks never be called inside conditional statements or loops?',
    options: [
      'They will throw a syntax error during compilation',
      'React relies on the call order of hooks remaining identical between renders to preserve state',
      'Conditional statements cause memory leaks in JavaScript',
      'Hooks can only be called in plain JavaScript files'
    ],
    correctOption: 1,
    explanation: 'React tracks hook state by internal index order across successive renders.',
    marks: 10
  },
  {
    questionText: 'What HTTP status code should be returned when a resource is successfully created via a POST request?',
    options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
    correctOption: 1,
    explanation: 'HTTP 201 Created indicates the request succeeded and resulted in a new resource.',
    marks: 10
  },
  {
    questionText: 'What is the role of Mongoose pre-save middleware in a MERN application?',
    options: [
      'To validate incoming HTTP request cookies',
      'To execute custom logic (such as hashing passwords) before document persistence',
      'To send automated emails to clients',
      'To bundle frontend React assets'
    ],
    correctOption: 1,
    explanation: 'pre("save") hooks allow interception before MongoDB writes.',
    marks: 10
  },
  {
    questionText: 'What is the Virtual DOM in React and why is it beneficial?',
    options: [
      'A direct copy of the browser DOM stored in Web Workers',
      'An in-memory lightweight representation of the actual DOM used to compute efficient batched updates',
      'A plugin that connects React with MongoDB',
      'A browser extension for debugging React components'
    ],
    correctOption: 1,
    explanation: 'Virtual DOM computes the diff before applying minimal mutations to the real DOM.',
    marks: 10
  },
  {
    questionText: 'What does CORS stand for in web development and why is it enforced?',
    options: [
      'Cross-Origin Resource Sharing; enforced by browsers to prevent unauthorized cross-origin requests',
      'Central Operating Routing System; enforced by Node.js to manage ports',
      'Client Online Registration Standard; enforced by MongoDB for access control',
      'Cascading Object Reference Sheets; used for CSS styling'
    ],
    correctOption: 0,
    explanation: 'CORS is a security mechanism enforced by browsers.',
    marks: 10
  },
  {
    questionText: 'Which Mongoose method finds a single document and updates it atomically?',
    options: ['findAndModify()', 'findOneAndUpdate()', 'updateAtomic()', 'searchAndUpdate()'],
    correctOption: 1,
    explanation: 'findOneAndUpdate() issues an atomic MongoDB findAndModify update command.',
    marks: 10
  },
  {
    questionText: 'What is the role of body-parser or express.json() middleware in Express?',
    options: [
      'Compresses images sent in the payload',
      'Parses incoming requests with JSON payloads and populates req.body',
      'Validates JWT tokens automatically',
      'Logs request durations'
    ],
    correctOption: 1,
    explanation: 'express.json() parses incoming JSON request bodies into JavaScript objects on req.body.',
    marks: 10
  },
  {
    questionText: 'In React 18 and 19, what hook is used to access values passed through React Context?',
    options: ['useConsumer()', 'useContext()', 'useValue()', 'useStore()'],
    correctOption: 1,
    explanation: 'useContext accepts a context object and returns current context value.',
    marks: 10
  },
  {
    questionText: 'Which operator is used in MongoDB queries to perform an equality match on an array of values?',
    options: ['$in', '$eqAll', '$has', '$contains'],
    correctOption: 0,
    explanation: '$in selects documents where the value of a field equals any value in the specified array.',
    marks: 10
  },
  {
    questionText: 'In Node.js, what does process.env contain?',
    options: [
      'Active hardware specifications of the server',
      'User environment variables and system configuration values',
      'All installed npm packages',
      'The current git branch name'
    ],
    correctOption: 1,
    explanation: 'process.env is a global object containing the user environment variables.',
    marks: 10
  },
  {
    questionText: 'What is the purpose of useRef hook in React?',
    options: [
      'Triggers a re-render whenever the referenced value changes',
      'Holds a mutable reference that persists across renders without causing a re-render',
      'Connects component to Redux store',
      'Fetches external REST APIs'
    ],
    correctOption: 1,
    explanation: 'useRef returns a mutable ref object whose .current property is maintained across renders without re-rendering.',
    marks: 10
  },
  {
    questionText: 'What is the difference between res.send() and res.json() in Express?',
    options: [
      'res.send cannot send strings',
      'res.json explicitly formats the response as JSON and sets the Content-Type header to application/json',
      'res.send is only for HTML files',
      'There is no difference at all'
    ],
    correctOption: 1,
    explanation: 'res.json() converts objects/arrays to JSON and sets Content-Type: application/json.',
    marks: 10
  },
  {
    questionText: 'In MongoDB, what does the _id field represent if not specified on creation?',
    options: [
      'A random integer from 1 to 1000',
      'A 12-byte BSON ObjectId generated automatically by MongoDB containing timestamp and machine IDs',
      'A UUID version 4 string',
      'The document title'
    ],
    correctOption: 1,
    explanation: 'ObjectId is a 12-byte BSON type with timestamp, process ID, machine identifier, and counter.',
    marks: 10
  },
  {
    questionText: 'What is prop drilling in React applications?',
    options: [
      'Passing props through several layers of intermediate components that do not need them',
      'Validating props with TypeScript',
      'Deleting unused component props',
      'Rendering dynamic lists with keys'
    ],
    correctOption: 0,
    explanation: 'Prop drilling happens when data must pass through intermediate components to reach a deeply nested child.',
    marks: 10
  },
  {
    questionText: 'Which HTTP method should be used to apply partial modifications to a resource?',
    options: ['PUT', 'PATCH', 'POST', 'UPDATE'],
    correctOption: 1,
    explanation: 'PATCH is intended for partial modifications; PUT is for full replacement.',
    marks: 10
  },
  {
    questionText: 'What is the function of the package-lock.json file in a Node.js project?',
    options: [
      'Locks the repository so other developers cannot push',
      'Locks the exact dependency tree and versions installed to ensure reproducible builds across environments',
      'Stores encrypted environment passwords',
      'Minifies backend JavaScript files'
    ],
    correctOption: 1,
    explanation: 'package-lock.json pins exact dependency versions, sub-dependencies, and integrity hashes.',
    marks: 10
  },
  {
    questionText: 'In React, what will happen if you update state directly without using the setter (e.g. this.state.x = 5)?',
    options: [
      'React will throw a runtime error',
      'The component will not re-render because React does not detect the mutation',
      'The state will be saved to MongoDB automatically',
      'The browser will refresh'
    ],
    correctOption: 1,
    explanation: 'State mutations must go through the setState dispatcher to schedule a re-render.',
    marks: 10
  },
  {
    questionText: 'Which Mongoose schema option automatically adds createdAt and updatedAt fields to documents?',
    options: ['audited: true', 'timestamps: true', 'history: true', 'autoDate: true'],
    correctOption: 1,
    explanation: 'Setting { timestamps: true } instructs Mongoose to automatically manage createdAt and updatedAt.',
    marks: 10
  },
  {
    questionText: 'In Express, how is an error passed to the centralized error handling middleware?',
    options: ['throw res.error()', 'calling next(err) with an Error instance', 'return error', 'res.abort(err)'],
    correctOption: 1,
    explanation: 'Passing an argument to next(err) invokes error-handling middleware with (err, req, res, next).',
    marks: 10
  },
  {
    questionText: 'What is the primary benefit of React Fragments (<>...</>)?',
    options: [
      'Speeds up HTTP network requests',
      'Allows grouping a list of children without adding extra unnecessary nodes to the DOM tree',
      'Allows executing SQL queries in JSX',
      'Encrypts component props'
    ],
    correctOption: 1,
    explanation: 'Fragments avoid wrapping elements in superfluous divs.',
    marks: 10
  },
  {
    questionText: 'In MongoDB, what is an index and why is it used?',
    options: [
      'A backup of the collection stored in JSON format',
      'A special data structure (B-tree) that supports efficient execution of queries and avoids full collection scans',
      'A counter for total queries executed',
      'A list of database usernames'
    ],
    correctOption: 1,
    explanation: 'Indexes store a small portion of the collection dataset in an easy to traverse B-tree form.',
    marks: 10
  },
  {
    questionText: 'What does npm run build typically do in a modern React Vite application?',
    options: [
      'Starts a local development server with Hot Module Replacement',
      'Bundles, minifies, and tree-shakes assets into optimized static HTML, CSS, and JS files for production',
      'Installs all dependencies from npm',
      'Seeds the MongoDB database'
    ],
    correctOption: 1,
    explanation: 'Production build transforms JSX and ES modules into compressed, minified static files in dist/.',
    marks: 10
  },
  {
    questionText: 'What is the role of the Cluster module in Node.js?',
    options: [
      'To cluster React components into bundles',
      'To create child worker processes that share server ports, utilizing multi-core CPU architectures',
      'To cluster MongoDB documents into partitions',
      'To combine CSS files'
    ],
    correctOption: 1,
    explanation: 'Node.js is single-threaded; cluster module forks multiple worker processes to utilize multi-core CPUs.',
    marks: 10
  },
  {
    questionText: 'In React, what hook can be used as an alternative to useState for complex state logic with actions?',
    options: ['useDispatch()', 'useReducer()', 'useController()', 'useMachine()'],
    correctOption: 1,
    explanation: 'useReducer accepts a reducer of type (state, action) => newState and initial state.',
    marks: 10
  },
  {
    questionText: 'Which HTTP status code signifies 403 Forbidden?',
    options: [
      'The client has not provided authentication credentials',
      'The server understood the request and client identity, but refuses to authorize access to the resource',
      'The requested resource was not found',
      'The server crashed with an unhandled exception'
    ],
    correctOption: 1,
    explanation: '401 is Unauthorized (unauthenticated), while 403 is Forbidden (authenticated but lacking permission).',
    marks: 10
  },
  {
    questionText: 'What is MongoDB Atlas?',
    options: [
      'A desktop tool for designing schemas',
      'A fully managed multi-cloud database service for MongoDB in the cloud',
      'A query language alternative to SQL',
      'A React UI library'
    ],
    correctOption: 1,
    explanation: 'Atlas is MongoDB cloud hosted DBaaS with automated scaling and backups.',
    marks: 10
  },
  {
    questionText: 'In React, what is lifting state up?',
    options: [
      'Moving state to a global Redux store always',
      'Moving common state up to the closest shared ancestor component so multiple siblings can share it',
      'Uploading component state to cloud storage',
      'Deleting state when a component unmounts'
    ],
    correctOption: 1,
    explanation: 'Lifting state up shares state between components by placing it in their common parent.',
    marks: 10
  },
  {
    questionText: 'Which Node.js method converts a JavaScript object into a JSON string?',
    options: ['JSON.parse()', 'JSON.stringify()', 'JSON.toString()', 'JSON.encode()'],
    correctOption: 1,
    explanation: 'JSON.stringify() serializes a JavaScript object into a JSON string representation.',
    marks: 10
  },
  {
    questionText: 'In Mongoose, what is population (e.g. .populate("userId"))?',
    options: [
      'Filling the database with dummy random data',
      'Automatically replacing specified paths in a document with document(s) from other collections by reference',
      'Scaling the server across multiple geographic regions',
      'Validating user emails'
    ],
    correctOption: 1,
    explanation: 'Population is the Mongoose process of replacing referenced ObjectIds with actual documents.',
    marks: 10
  },
  {
    questionText: 'What is a controlled component in React forms?',
    options: [
      'A component that is controlled by backend Express routing',
      'An input form element whose value is driven and managed by React component state',
      'A component that has no event handlers',
      'A read-only component that cannot be edited'
    ],
    correctOption: 1,
    explanation: 'In a controlled component, form data is handled by component state via value and onChange props.',
    marks: 10
  },
  {
    questionText: 'What is the purpose of helmet npm package in Express applications?',
    options: [
      'Enhances CSS typography',
      'Sets various HTTP headers to secure Express apps against well-known web vulnerabilities',
      'Compresses HTTP responses with Gzip',
      'Handles multi-factor authentication'
    ],
    correctOption: 1,
    explanation: 'Helmet sets security headers like Content-Security-Policy, X-Frame-Options, X-XSS-Protection.',
    marks: 10
  },
  {
    questionText: 'What is reconciliation in React?',
    options: [
      'Merging git pull requests into the master branch',
      'The algorithm React uses to diff one tree of elements with another to determine which parts need update',
      'Authenticating a user token with the database',
      'Converting JSX into HTML'
    ],
    correctOption: 1,
    explanation: 'Reconciliation is the diffing algorithm React uses to generate minimal DOM updates.',
    marks: 10
  },
  {
    questionText: 'Which MongoDB method deletes multiple documents matching a given condition?',
    options: ['collection.removeMany()', 'collection.deleteMany()', 'collection.drop()', 'collection.purge()'],
    correctOption: 1,
    explanation: 'deleteMany() deletes all documents that match the specified filter query.',
    marks: 10
  },
  {
    questionText: 'What does the express-rate-limit middleware accomplish?',
    options: [
      'Measures the ping latency of API responses',
      'Limits repeated requests from the same IP to public APIs or auth endpoints to stop brute-force attacks',
      'Reduces the bandwidth usage of video files',
      'Limits the number of rows a database query can return'
    ],
    correctOption: 1,
    explanation: 'express-rate-limit stops brute force and DDoS attacks by capping requests per time window.',
    marks: 10
  },
  {
    questionText: 'In React, what will happen if useEffect has an empty dependency array []?',
    options: [
      'The effect runs on every single render cycle',
      'The effect will never execute',
      'The effect runs exactly once when the component mounts',
      'React throws an unhandled warning error'
    ],
    correctOption: 2,
    explanation: 'An empty dependency array indicates the effect does not depend on any props or state, running once on mount.',
    marks: 10
  },
  {
    questionText: 'What is the primary role of morgan middleware in an Express application?',
    options: [
      'Encrypts outgoing HTTP packets',
      'Logs incoming HTTP request details (method, URL, status code, response time) to the console',
      'Parses multipart/form-data files',
      'Handles user password reset emails'
    ],
    correctOption: 1,
    explanation: 'Morgan is an HTTP request logger middleware for Node.js.',
    marks: 10
  },
  {
    questionText: 'In MongoDB, what does the $set operator do during an update operation?',
    options: [
      'Creates a new mathematical set collection',
      'Replaces the value of a field with the specified value without replacing the entire document',
      'Sets a password on the document',
      'Validates schema rules'
    ],
    correctOption: 1,
    explanation: '$set replaces the value of specific fields without overwriting unmodified fields.',
    marks: 10
  },
  {
    questionText: 'What is the difference between synchronous and asynchronous code in Node.js?',
    options: [
      'Synchronous code runs in parallel; asynchronous code runs on one thread',
      'Synchronous blocks the event loop until finished; asynchronous offloads I/O and invokes callbacks when ready',
      'Synchronous code cannot throw errors',
      'Asynchronous code is deprecated in modern Node.js'
    ],
    correctOption: 1,
    explanation: 'Synchronous operations block the single thread; asynchronous non-blocking operations utilize the libuv event loop.',
    marks: 10
  },
  {
    questionText: 'What is lazy loading in React applications?',
    options: [
      'Delaying user authentication until checkout',
      'Deferring the loading of non-critical component code until the component is actually rendered',
      'Loading slow database queries in background',
      'Slowing down CSS animations'
    ],
    correctOption: 1,
    explanation: 'React.lazy lets you render a dynamic import as a regular component, splitting bundles.',
    marks: 10
  },
  {
    questionText: 'What is the purpose of dotenv npm package in a MERN project?',
    options: [
      'Validates domain name extensions',
      'Loads environment variables from a .env file into process.env',
      'Creates dot grid backgrounds with CSS',
      'Encrypts MongoDB database collections'
    ],
    correctOption: 1,
    explanation: 'dotenv parses .env files and loads the key-value pairs into process.env.',
    marks: 10
  },
  {
    questionText: 'In MongoDB, what is sharding?',
    options: [
      'Dividing a database into relational tables',
      'Distributing data across multiple physical machines to support deployments with very large datasets and high throughput',
      'Compressing collections to reduce disk usage',
      'Deleting stale indexes'
    ],
    correctOption: 1,
    explanation: 'Sharding is horizontal scaling through distributing data across multiple replica sets.',
    marks: 10
  },
  {
    questionText: 'What is the key difference between Server-Side Rendering (SSR) and Client-Side Rendering (CSR)?',
    options: [
      'SSR sends pre-rendered HTML from the server for faster initial paint; CSR downloads JS and renders HTML in the browser',
      'CSR cannot use CSS stylesheets',
      'SSR cannot use JavaScript',
      'CSR is only used for mobile applications'
    ],
    correctOption: 0,
    explanation: 'SSR renders HTML on the server before sending to the client, while CSR renders DOM elements in the browser via JavaScript.',
    marks: 10
  },
  {
    questionText: 'What is the purpose of the key prop in React lists?',
    options: [
      'Acts as a password to access component data',
      'Provides a stable identity to list items so React can identify which items changed, were added, or were removed',
      'Sorts items alphabetically by default',
      'Styles the list item'
    ],
    correctOption: 1,
    explanation: 'Keys help React identify which items have changed, are added, or are removed during reconciliation.',
    marks: 10
  },
  {
    questionText: 'Which HTTP header specifies the MIME type of the payload being transmitted?',
    options: ['Accept-Encoding', 'Content-Type', 'User-Agent', 'Cache-Control'],
    correctOption: 1,
    explanation: 'The Content-Type representation header is used to indicate the original media type of the resource.',
    marks: 10
  },
  {
    questionText: 'In MongoDB, what does the $lookup stage do in an aggregation pipeline?',
    options: [
      'Performs a full text search in Google',
      'Performs a left outer join to an unsharded collection in the same database to filter in documents from the joined collection',
      'Validates schema rules on insert',
      'Encrypts document fields'
    ],
    correctOption: 1,
    explanation: '$lookup performs a left outer join to another collection in the same database.',
    marks: 10
  }
];

// 2. JavaScript Mastery Pool (50 questions)
const jsQuestions = [
  {
    questionText: 'What is a closure in JavaScript?',
    options: [
      'A method that terminates an open database connection',
      'A function bundled with references to its surrounding lexical environment',
      'An IIFE that clears the call stack',
      'A tool for minifying code'
    ],
    correctOption: 1,
    explanation: 'A closure gives an inner function access to its outer scope even after the outer function has finished executing.',
    marks: 10
  },
  {
    questionText: 'What is the output of typeof null in JavaScript?',
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correctOption: 2,
    explanation: "typeof null returns 'object' due to a historical legacy bug in the initial JavaScript implementation.",
    marks: 10
  },
  {
    questionText: 'Which queue has higher priority in the JavaScript Event Loop?',
    options: [
      'Macrotask queue (e.g. setTimeout, setInterval)',
      'Microtask queue (e.g. Promise callbacks, queueMicrotask)',
      'I/O polling queue',
      'They have equal round-robin priority'
    ],
    correctOption: 1,
    explanation: 'The microtask queue is processed completely after the current execution context and before the next macrotask.',
    marks: 10
  },
  {
    questionText: 'What does Promise.all() do when one of the passed promises rejects?',
    options: [
      'It ignores the rejected promise and returns the resolved ones',
      'It immediately rejects with the reason of the first rejected promise (fail-fast)',
      'It waits for all promises and returns null',
      'It throws an uncatchable syntax error'
    ],
    correctOption: 1,
    explanation: 'Promise.all() rejects immediately upon any rejection. For waiting on all results regardless of outcome, Promise.allSettled() is used.',
    marks: 10
  },
  {
    questionText: 'What is the difference between == and === in JavaScript?',
    options: [
      '== compares value with type coercion; === performs strict equality without coercion',
      '=== only compares numbers',
      '== is faster than ===',
      'There is no difference'
    ],
    correctOption: 0,
    explanation: 'Strict equality (===) checks both value and type, whereas loose equality (==) coerces types before comparison.',
    marks: 10
  },
  {
    questionText: 'What is variable hoisting in JavaScript?',
    options: [
      'Uploading variables to a cloud server',
      'The process where variable and function declarations are moved to the top of their containing scope during compilation',
      'Deleting unused variables to free RAM',
      'Converting local variables into global variables'
    ],
    correctOption: 1,
    explanation: 'Declarations are evaluated before any code is executed; var is initialized with undefined, while let/const remain in Temporal Dead Zone (TDZ).',
    marks: 10
  },
  {
    questionText: 'Which method creates a new array populated with the results of calling a provided function on every element in the calling array?',
    options: ['filter()', 'forEach()', 'map()', 'reduce()'],
    correctOption: 2,
    explanation: 'Array.prototype.map() returns a brand new array with transformed elements without mutating the original array.',
    marks: 10
  },
  {
    questionText: 'What is the effect of using "use strict" in a JavaScript file?',
    options: [
      'Prevents execution on older browsers',
      'Catches silent errors, disallows global variable creation without declaration, and prohibits obsolete features',
      'Enforces TypeScript static types at runtime',
      'Compresses the JavaScript code automatically'
    ],
    correctOption: 1,
    explanation: 'Strict mode enforces stricter parsing and error handling, turning silent bugs into throwing exceptions.',
    marks: 10
  },
  {
    questionText: 'What does the bind() method do when invoked on a JavaScript function?',
    options: [
      'Executes the function immediately with given arguments',
      'Creates a new function that, when called, has its this keyword set to the provided value',
      'Binds the function to a database connection',
      'Prevents the function from throwing errors'
    ],
    correctOption: 1,
    explanation: 'Function.prototype.bind() returns a new function with a permanently bound this context.',
    marks: 10
  },
  {
    questionText: 'What is the Temporal Dead Zone (TDZ) in JavaScript?',
    options: [
      'The time it takes for setTimeout(fn, 0) to execute',
      'The period between entering scope and variable declaration where let and const variables cannot be accessed',
      'The time when the garbage collector frees memory',
      'The lifespan of a browser cookie'
    ],
    correctOption: 1,
    explanation: 'Accessing let or const before their declaration line throws a ReferenceError due to the TDZ.',
    marks: 10
  },
  {
    questionText: 'What is the difference between call() and apply() methods in JavaScript?',
    options: [
      'call() accepts an array of arguments; apply() accepts arguments listed individually',
      'call() accepts arguments individually comma-separated; apply() accepts arguments as an array',
      'call() is asynchronous; apply() is synchronous',
      'There is no difference'
    ],
    correctOption: 1,
    explanation: 'Both set the this context: call(thisArg, arg1, arg2) vs apply(thisArg, [arg1, arg2]).',
    marks: 10
  },
  {
    questionText: 'What does Object.freeze() do to a JavaScript object?',
    options: [
      'Prevents adding new properties, removing existing properties, and modifying property values or prototypes',
      'Only hides private properties',
      'Turns the object into a JSON string',
      'Deletes the object from memory'
    ],
    correctOption: 0,
    explanation: 'Object.freeze() makes an object shallowly immutable.',
    marks: 10
  },
  {
    questionText: 'What is the result of 0.1 + 0.2 === 0.3 in JavaScript?',
    options: ['true', 'false', 'undefined', 'NaN'],
    correctOption: 1,
    explanation: 'Due to IEEE 754 binary floating-point precision, 0.1 + 0.2 equals 0.30000000000000004.',
    marks: 10
  },
  {
    questionText: 'What is the purpose of the Symbol primitive type introduced in ES6?',
    options: [
      'To represent graphical icons in the console',
      'To create unique, immutable identifiers that can be used as non-enumerable object property keys',
      'To store large integers',
      'To execute regular expressions faster'
    ],
    correctOption: 1,
    explanation: 'Every Symbol() call returns a completely unique value, avoiding collision in object keys.',
    marks: 10
  },
  {
    questionText: 'How does the JavaScript engine handle garbage collection primarily?',
    options: [
      'Manual developer memory deallocation (like free() in C)',
      'Mark-and-Sweep algorithm tracing unreachable objects from roots',
      'Automatic deletion of variables after 10 seconds',
      'Random object purging'
    ],
    correctOption: 1,
    explanation: 'Modern engines use generational Mark-and-Sweep GC starting from root references.',
    marks: 10
  },
  {
    questionText: 'What is the output of [1, 2, 3] + [4, 5, 6] in JavaScript?',
    options: ['[1, 2, 3, 4, 5, 6]', '"1,2,34,5,6"', 'NaN', 'TypeError'],
    correctOption: 1,
    explanation: 'The + operator coerces arrays into strings ("1,2,3" + "4,5,6") resulting in "1,2,34,5,6".',
    marks: 10
  },
  {
    questionText: 'What is the purpose of Promise.race()?',
    options: [
      'Returns a promise that resolves only if all promises resolve',
      'Returns a promise that fulfills or rejects as soon as any one of the input promises settles',
      'Executes promises in sequential order',
      'Cancels the slowest promise'
    ],
    correctOption: 1,
    explanation: 'Promise.race() settles with the value or reason of the first promise that settles.',
    marks: 10
  },
  {
    questionText: 'What is an IIFE (Immediately Invoked Function Expression)?',
    options: [
      'A function that can never be executed',
      'A JavaScript function that runs as soon as it is defined',
      'A function that runs inside a Web Worker',
      'An asynchronous function that returns a Promise'
    ],
    correctOption: 1,
    explanation: 'IIFEs: (function(){ ... })(); execute immediately upon parsing and avoid polluting the global scope.',
    marks: 10
  },
  {
    questionText: 'What is the prototype chain in JavaScript?',
    options: [
      'A linked list of active event listeners',
      'The mechanism by which JavaScript objects inherit features and properties from one another',
      'A blockchain network inside Node.js',
      'A chain of middleware functions'
    ],
    correctOption: 1,
    explanation: 'When accessing a property on an object, JavaScript looks up the __proto__ chain until found or null.',
    marks: 10
  },
  {
    questionText: 'What is currying in functional JavaScript?',
    options: [
      'Adding spices to code comments',
      'Transforming a function with multiple arguments into a sequence of nesting functions each taking a single argument',
      'Calling a function inside a loop',
      'Deleting unused function parameters'
    ],
    correctOption: 1,
    explanation: 'Currying transforms f(a, b, c) into f(a)(b)(c).',
    marks: 10
  },
  {
    questionText: 'Which statement accurately describes arrow functions regarding the "this" keyword?',
    options: [
      'Arrow functions have their own dynamic this depending on invocation site',
      'Arrow functions do not bind their own this; they retain the this value of the enclosing lexical context',
      'Arrow functions can be used as constructors with new',
      'Arrow functions bind this to the window object always'
    ],
    correctOption: 1,
    explanation: 'Arrow functions capture this lexically from the scope where they were defined.',
    marks: 10
  },
  {
    questionText: 'What is the difference between Map and plain Object in JavaScript?',
    options: [
      'Object keys can be of any type, while Map keys can only be strings',
      'Map keys can be of any type (including functions and objects), remembers insertion order, and has a size property',
      'Map cannot store numbers',
      'Object is always faster for searching than Map'
    ],
    correctOption: 1,
    explanation: 'Maps allow any key type, preserve insertion order, and provide direct .size property.',
    marks: 10
  },
  {
    questionText: 'What is the purpose of WeakMap in JavaScript?',
    options: [
      'A Map that can only store up to 10 items',
      'A collection of key/value pairs in which the keys must be objects and are weakly referenced, enabling garbage collection',
      'A Map that does not support get() method',
      'A Map used for slow internet connections'
    ],
    correctOption: 1,
    explanation: 'WeakMap keys are weakly held objects; if there are no other references, the entry is eligible for GC.',
    marks: 10
  },
  {
    questionText: 'What will Boolean("false") evaluate to in JavaScript?',
    options: ['false', 'true', 'null', 'TypeError'],
    correctOption: 1,
    explanation: 'Any non-empty string in JavaScript evaluates to true when converted to a boolean.',
    marks: 10
  },
  {
    questionText: 'What does the optional chaining operator (?.) do?',
    options: [
      'Checks if a number is positive or negative',
      'Allows reading the value of a property located deep within a chain without throwing an error if a reference is nullish',
      'Creates an optional function parameter',
      'Comments out code dynamically'
    ],
    correctOption: 1,
    explanation: 'obj?.prop short-circuits and returns undefined if obj is null or undefined instead of throwing TypeError.',
    marks: 10
  },
  {
    questionText: 'What does the nullish coalescing operator (??) check for?',
    options: [
      'Checks if a value is falsy (0, "", false, null, undefined)',
      'Checks specifically if a value is null or undefined only',
      'Checks if a variable is an object',
      'Checks if an array is empty'
    ],
    correctOption: 1,
    explanation: '?? only falls back to right-hand operand if the left-hand operand is null or undefined (not for 0 or "").',
    marks: 10
  },
  {
    questionText: 'What does Array.prototype.reduce() do when no initial value is provided?',
    options: [
      'Throws a TypeError on all arrays',
      'Uses the first element of the array as the initial accumulator and begins iteration at the second element',
      'Defaults the accumulator to 0',
      'Defaults the accumulator to empty string'
    ],
    correctOption: 1,
    explanation: 'If initialValue is not provided, reduce() takes index 0 as accumulator and starts loop from index 1.',
    marks: 10
  },
  {
    questionText: 'What is debounce technique in frontend JavaScript?',
    options: [
      'Bouncing animations across the screen',
      'Limiting the rate at which a function fires by delaying execution until a set duration of inactivity passes',
      'Executing a function on every pixel scroll',
      'Preventing keyboard input'
    ],
    correctOption: 1,
    explanation: 'Debouncing ensures that a function is not called again until a certain amount of time has passed without calls.',
    marks: 10
  },
  {
    questionText: 'What is throttling in JavaScript?',
    options: [
      'Deleting functions from memory',
      'Enforcing a maximum number of times a function can be called over a given time interval',
      'Encrypting data packets',
      'Speeding up code execution'
    ],
    correctOption: 1,
    explanation: 'Throttling ensures the target function executes at most once per specified time window.',
    marks: 10
  },
  {
    questionText: 'What is the purpose of the generator function (function*) in JavaScript?',
    options: [
      'Generates random numbers continuously',
      'Defines a function that can be exited and later re-entered, with context saved across re-entrances via yield',
      'Creates HTML templates dynamically',
      'Spawns new Node.js threads'
    ],
    correctOption: 1,
    explanation: 'Generators return an Iterator object and can yield values sequentially on demand.',
    marks: 10
  },
  {
    questionText: 'What is event bubbling in the browser DOM?',
    options: [
      'Events that emit sound waves through the speaker',
      'The propagation of an event starting from the deepest target element and moving up through ancestor elements to the window',
      'The capture of an event from window down to target',
      'Canceling an event immediately'
    ],
    correctOption: 1,
    explanation: 'In bubbling phase, an event triggers on the target and bubbles upwards through parent DOM hierarchy.',
    marks: 10
  },
  {
    questionText: 'How can you stop event bubbling in an event listener?',
    options: ['e.preventDefault()', 'e.stopPropagation()', 'e.cancel()', 'return false'],
    correctOption: 1,
    explanation: 'e.stopPropagation() stops the event from propagating further up the DOM tree.',
    marks: 10
  },
  {
    questionText: 'What does e.preventDefault() do?',
    options: [
      'Stops event bubbling to parent elements',
      'Prevents the default browser action associated with the event (e.g. form submission page reload, link navigation)',
      'Removes the element from the DOM',
      'Clears the form input fields'
    ],
    correctOption: 1,
    explanation: 'preventDefault() cancels the browser default behavior without stopping event propagation.',
    marks: 10
  },
  {
    questionText: 'What is event delegation in JavaScript?',
    options: [
      'Delegating server tasks to background cron jobs',
      'Attaching a single event listener to a common parent element to handle events for all existing and future child elements',
      'Passing functions as callbacks to promises',
      'Using WebSockets instead of HTTP'
    ],
    correctOption: 1,
    explanation: 'Event delegation leverages event bubbling to manage events for multiple child nodes at a single parent.',
    marks: 10
  },
  {
    questionText: 'What is the difference between shallow copy and deep copy?',
    options: [
      'Shallow copy only copies numbers; deep copy copies strings',
      'Shallow copy duplicates top-level properties but retains references to nested objects; deep copy duplicates all nested objects recursively',
      'Deep copy is faster than shallow copy',
      'There is no distinction in JavaScript'
    ],
    correctOption: 1,
    explanation: 'Shallow copy (e.g. {...obj}) shares references to nested objects. structuredClone(obj) provides deep copying.',
    marks: 10
  },
  {
    questionText: 'Which modern global JavaScript function creates a deep clone of a serializable object?',
    options: ['Object.clone()', 'structuredClone()', 'JSON.copy()', 'cloneDeep()'],
    correctOption: 1,
    explanation: 'structuredClone() is the built-in standard method for deep-copying objects including Dates, RegExps, Maps, Sets.',
    marks: 10
  },
  {
    questionText: 'What is the output of NaN === NaN in JavaScript?',
    options: ['true', 'false', 'undefined', 'TypeError'],
    correctOption: 1,
    explanation: 'NaN is the only value in JavaScript that is not equal to itself; use Number.isNaN() to test.',
    marks: 10
  },
  {
    questionText: 'What does Array.prototype.flat() do?',
    options: [
      'Removes all undefined elements from an array',
      'Creates a new array with all sub-array elements concatenated into it recursively up to the specified depth',
      'Flattens an object into an array',
      'Sorts an array descending'
    ],
    correctOption: 1,
    explanation: 'flat(depth) flattens nested arrays into a single-level or reduced-depth array.',
    marks: 10
  },
  {
    questionText: 'What does the spread operator (...) do when applied to an array in a function call?',
    options: [
      'Expands the array elements into individual arguments for the function',
      'Packs the arguments into a single array',
      'Deletes the array',
      'Reverses the array'
    ],
    correctOption: 0,
    explanation: 'fn(...arr) spreads the iterable elements across the parameter list.',
    marks: 10
  },
  {
    questionText: 'What is a pure function in programming?',
    options: [
      'A function that contains no comments',
      'A function that returns the same output for identical inputs and causes no observable side effects',
      'A function written in assembly code',
      'A function with no arguments'
    ],
    correctOption: 1,
    explanation: 'Pure functions are deterministic and do not mutate external state or perform uncontained I/O.',
    marks: 10
  },
  {
    questionText: 'What is the purpose of the Set object in ES6?',
    options: [
      'To set HTTP cookies',
      'To store a collection of unique values of any type, discarding duplicates automatically',
      'To set CSS styles',
      'To schedule background timeouts'
    ],
    correctOption: 1,
    explanation: 'A Set is a collection of unique values; adding a duplicate value has no effect.',
    marks: 10
  },
  {
    questionText: 'What is the purpose of Proxy in JavaScript?',
    options: [
      'To bypass corporate firewalls',
      'To wrap an object and intercept fundamental operations such as property lookup, assignment, enumeration, and function invocation',
      'To connect to a VPN',
      'To compress images'
    ],
    correctOption: 1,
    explanation: 'Proxy enables customization of object behaviors via traps (get, set, has, deleteProperty).',
    marks: 10
  },
  {
    questionText: 'What does Reflect API do in JavaScript?',
    options: [
      'Creates optical UI reflections',
      'Provides methods for interceptable JavaScript operations, designed to work alongside Proxy handlers',
      'Inverts colors in the browser',
      'Reverses strings'
    ],
    correctOption: 1,
    explanation: 'Reflect provides clean functional equivalents to internal object operations (e.g. Reflect.get, Reflect.set).',
    marks: 10
  },
  {
    questionText: 'What is the return value of an async function in JavaScript?',
    options: ['The value returned directly', 'Always a Promise that resolves with the returned value', 'undefined', 'A callback function'],
    correctOption: 1,
    explanation: 'Async functions always wrap their return value in a Promise.',
    marks: 10
  },
  {
    questionText: 'What will happen if an unhandled promise rejection occurs in modern Node.js?',
    options: [
      'Node.js ignores it silently',
      'Node.js logs an UnhandledPromiseRejection warning and terminates the process with a non-zero exit code',
      'The server restarts automatically',
      'The client receives a 200 OK'
    ],
    correctOption: 1,
    explanation: 'Since Node.js v15+, unhandled rejections terminate the process with exit code 1.',
    marks: 10
  },
  {
    questionText: 'Which JavaScript method parses a string representation of an integer with a specified radix (base)?',
    options: ['Number.parse()', 'parseInt(string, radix)', 'Math.floor()', 'Number.toInt()'],
    correctOption: 1,
    explanation: 'parseInt(str, radix) parses a string and returns an integer in the specified numeral system.',
    marks: 10
  },
  {
    questionText: 'What is the difference between null and undefined in JavaScript?',
    options: [
      'null is assigned automatically by JS engine; undefined is set explicitly by developers',
      'undefined represents an uninitialized or unassigned variable; null represents intentional absence of any object value',
      'null is a boolean type; undefined is a string type',
      'There is no distinction'
    ],
    correctOption: 1,
    explanation: 'undefined means a variable has been declared but not defined; null is an assigned assignment value representing "nothing".',
    marks: 10
  },
  {
    questionText: 'What is tail call optimization (TCO)?',
    options: [
      'Optimizing the last line of a JavaScript file',
      'Reusing the current stack frame for a function call when it is the final action in the calling function, preventing stack overflow in recursion',
      'Compressing CSS classes',
      'Deleting unused variables'
    ],
    correctOption: 1,
    explanation: 'TCO enables recursive functions without growing the execution call stack when the recursive call is in tail position.',
    marks: 10
  },
  {
    questionText: 'What does the in operator check in JavaScript?',
    options: [
      'Checks if a value is present in an array by value',
      'Returns true if the specified property key is in the specified object or its prototype chain',
      'Checks if an element is inside the DOM',
      'Checks if a number is within a range'
    ],
    correctOption: 1,
    explanation: '"prop" in obj returns true if prop exists on obj or anywhere along its prototype chain.',
    marks: 10
  },
  {
    questionText: 'What does Object.hasOwn(obj, prop) do compared to obj.hasOwnProperty(prop)?',
    options: [
      'It works safely even on objects created with Object.create(null) or where hasOwnProperty is overridden',
      'It only works with numbers',
      'It is deprecated in ES2022',
      'It checks prototype properties'
    ],
    correctOption: 0,
    explanation: 'Object.hasOwn is the modern safe alternative that prevents errors on prototype-less objects.',
    marks: 10
  }
];

// Combine all assessments with rich pools
const fullExams = [
  {
    title: 'MERN Stack Assessment',
    description: 'Comprehensive test on MongoDB, Express.js, React, Node.js, RESTful architecture, and state management. Random 10 questions per session.',
    category: 'MERN Stack',
    durationMinutes: 20,
    passingPercentage: 60,
    isActive: true,
    questions: mernQuestions
  },
  {
    title: 'JavaScript Core & Async Mastery',
    description: 'Deep-dive into closures, prototypes, event loops, promises, async/await, and modern ECMAScript features. Random 10 questions per session.',
    category: 'JavaScript',
    durationMinutes: 20,
    passingPercentage: 70,
    isActive: true,
    questions: jsQuestions
  }
];

// Write updated exams.json
const outputPath = path.join(__dirname, 'exams.json');
fs.writeFileSync(outputPath, JSON.stringify(fullExams, null, 2), 'utf8');
console.log(`Successfully generated exams.json with pools: MERN (${mernQuestions.length} questions), JS (${jsQuestions.length} questions)`);
