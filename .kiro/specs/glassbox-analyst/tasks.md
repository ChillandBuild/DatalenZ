# Implementation Plan

## Phase 1: Project Setup and Core Infrastructure

- [-] 1. Initialize monorepo structure
  - Create root directory with frontend and backend folders
  - Set up package.json for monorepo management (npm workspaces or pnpm)
  - Create .gitignore for both frontend and backend
  - Initialize git repository
  - _Requirements: 12.1, 12.2, 12.3_

- [ ] 2. Set up Next.js frontend
  - Initialize Next.js 14 project with App Router
  - Configure TypeScript with strict mode
  - Install and configure Tailwind CSS
  - Install Shadcn UI and initialize components
  - Create basic folder structure: app/, components/, lib/, types/
  - _Requirements: 12.3, 12.4, 10.4_

- [ ] 3. Set up FastAPI backend
  - Initialize Python project with Poetry or pip
  - Create FastAPI application with main.py
  - Configure CORS middleware for frontend communication
  - Set up environment variable management with python-dotenv
  - Create folder structure: services/, agents/, models/, api/
  - Add health check endpoint GET /health
  - _Requirements: 12.2, 12.1_

- [ ]* 3.1 Write unit tests for health check endpoint
  - Test health endpoint returns 200 status
  - Test CORS headers are properly set
  - _Requirements: 12.2_

- [ ] 4. Configure Supabase authentication
  - Create Supabase project and obtain credentials
  - Install Supabase client libraries (frontend and backend)
  - Set up environment variables for Supabase URL and keys
  - Create authentication context in Next.js
  - Implement login/signup UI components using Shadcn
  - _Requirements: 9.1_

- [ ]* 4.1 Write unit tests for authentication flow
  - Test login with valid credentials
  - Test login with invalid credentials
  - Test token validation
  - _Requirements: 9.1_

## Phase 2: Database Schema and Models

- [ ] 5. Create database schema in Supabase
  - Create sessions table with proper columns and indexes
  - Create messages table with foreign key to sessions
  - Create execution_logs table
  - Create pii_redactions table for audit
  - Set up Row-Level Security (RLS) policies
  - _Requirements: 9.2, 9.5_

- [ ] 6. Implement Pydantic data models
  - Create ColumnInfo, DatasetSchema models
  - Create ExecutionPlan, ExecutionResult models
  - Create Session, Message models
  - Create Redaction model for PII tracking
  - Add validation rules to all models
  - _Requirements: 1.4, 2.1, 9.5_

- [ ]* 6.1 Write unit tests for data model validation
  - Test model validation with valid data
  - Test model validation rejects invalid data
  - Test model serialization/deserialization
  - _Requirements: 1.4_

- [ ] 7. Implement TypeScript interfaces
  - Create Message, Artifact interfaces
  - Create ExecutionResult, Session interfaces
  - Create DatasetSchema, ColumnInfo interfaces
  - Export all types from central types/index.ts
  - _Requirements: 10.1, 10.3_

## Phase 3: File Upload and Dataset Profiling

- [ ] 8. Implement file upload UI component
  - Create FileUpload component with drag-and-drop zone
  - Add file type validation (CSV, Excel only)
  - Add file size validation (100MB limit)
  - Show upload progress indicator
  - Display error messages for invalid files
  - _Requirements: 1.1, 1.2_

- [ ]* 8.1 Write unit tests for file upload component
  - Test drag-and-drop functionality
  - Test file type validation
  - Test file size validation
  - _Requirements: 1.1, 1.2_


- [ ] 9. Implement file upload API endpoint
  - Create POST /api/upload endpoint in FastAPI
  - Accept multipart/form-data file uploads
  - Validate file type and size on backend
  - Stream file to temporary buffer (no disk persistence)
  - Return upload success response with file metadata
  - _Requirements: 1.1, 1.2, 1.5_

- [ ]* 9.1 Write unit tests for upload endpoint
  - Test CSV file upload
  - Test Excel file upload
  - Test file size limit enforcement
  - Test invalid file type rejection
  - _Requirements: 1.1, 1.2_

- [ ] 10. Implement file handler service
  - Create FileHandler class in services/file_handler.py
  - Implement process_csv() method using pandas
  - Implement process_excel() method using pandas
  - Implement extract_metadata() to read first 5 rows only
  - Generate DatasetSchema with column info
  - _Requirements: 1.3, 1.4_

- [ ]* 10.1 Write property test for limited data profiling
  - **Property 1: Limited data profiling**
  - **Validates: Requirements 1.3, 1.5**
  - Generate random DataFrames with 10-10000 rows
  - Verify profiling reads exactly 5 rows
  - Verify schema doesn't contain full dataset

- [ ]* 10.2 Write property test for schema completeness
  - **Property 2: Schema completeness**
  - **Validates: Requirements 1.4**
  - Generate random DataFrames with various column types
  - Verify schema includes all columns with correct metadata

- [ ] 11. Implement PII scrubber service
  - Install Microsoft Presidio libraries
  - Create PIIScrubber class in services/pii_scrubber.py
  - Implement scrub_text() method for email and phone detection
  - Implement scrub_dataframe_sample() for dataset samples
  - Return both scrubbed text and list of redactions
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]* 11.1 Write property test for PII redaction
  - **Property 17: PII redaction**
  - **Validates: Requirements 8.1, 8.2, 8.3**
  - Generate random text with emails and phone numbers
  - Verify all PII is replaced with placeholders
  - Verify original structure is maintained

- [ ] 12. Implement profiling agent
  - Create ProfilingAgent class in agents/profiling_agent.py
  - Set up OpenRouter API client
  - Implement analyze_schema() method
  - Create prompt template for schema analysis
  - Integrate PII scrubber before sending to LLM
  - Return ProfileResult with insights
  - _Requirements: 1.4, 11.1_

- [ ]* 12.1 Write unit tests for profiling agent
  - Test schema analysis with sample data
  - Test PII scrubbing integration
  - Test OpenRouter API error handling
  - _Requirements: 1.4, 8.1_

## Phase 4: E2B Sandbox Integration

- [ ] 13. Set up E2B sandbox client
  - Install E2B SDK
  - Create E2BSandboxClient class in services/e2b_client.py
  - Implement create_sandbox() with 300s timeout
  - Implement execute_code() method
  - Implement upload_file() for dataset transfer
  - Configure pre-installed packages: pandas, plotly, numpy, scipy
  - _Requirements: 2.5, 6.2, 7.1_

- [ ]* 13.1 Write unit tests for E2B client
  - Test sandbox creation
  - Test code execution with mocked E2B API
  - Test file upload functionality
  - _Requirements: 2.5, 7.1_

- [ ]* 13.2 Write property test for isolated execution
  - **Property 5: Isolated execution**
  - **Validates: Requirements 2.5, 7.1, 7.2**
  - Generate various Python code strings
  - Verify all execution goes through E2B client
  - Verify no local exec/eval calls

- [ ] 14. Implement session manager
  - Create SessionManager class in services/session_manager.py
  - Implement create_session() to initialize session and sandbox
  - Implement get_sandbox() to retrieve active sandbox
  - Implement keep_alive() to extend sandbox timeout
  - Implement terminate_session() to cleanup sandbox
  - Add background task for automatic timeout cleanup
  - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [ ]* 14.1 Write property test for stateful sandbox
  - **Property 14: Stateful sandbox**
  - **Validates: Requirements 6.1, 6.3**
  - Generate random variable assignments
  - Execute follow-up code referencing those variables
  - Verify variables are accessible

- [ ]* 14.2 Write property test for fresh session isolation
  - **Property 15: Fresh session isolation**
  - **Validates: Requirements 6.5**
  - Create multiple sessions
  - Verify each gets a unique sandbox
  - Verify no state leakage between sessions

- [ ]* 14.3 Write unit tests for session lifecycle
  - Test session creation
  - Test session timeout handling
  - Test session termination
  - _Requirements: 6.2, 6.4_

## Phase 5: AI Agent Implementation

- [ ] 15. Set up OpenRouter API client
  - Create OpenRouterClient class in services/openrouter_client.py
  - Implement chat completion method
  - Add retry logic with exponential backoff
  - Add rate limit handling
  - Secure API key from environment variables
  - _Requirements: 11.1, 11.2, 11.4_

- [ ]* 15.1 Write property test for rate limit handling
  - **Property 25: Rate limit handling**
  - **Validates: Requirements 11.4**
  - Simulate rate limit responses
  - Verify exponential backoff delays
  - Verify eventual success or proper failure

- [ ]* 15.2 Write property test for API key security
  - **Property 26: API key security**
  - **Validates: Requirements 11.5**
  - Trigger API errors
  - Verify error messages don't contain API key

- [ ] 16. Implement reasoning agent with smolagents
  - Install smolagents framework
  - Create ReasoningAgent class in agents/reasoning_agent.py
  - Define system prompt for data science expert
  - Implement generate_plan() method
  - Implement generate_code() method
  - Create run_python tool that calls E2B sandbox
  - Integrate with OpenRouter client
  - _Requirements: 2.1, 2.3, 11.3_

- [ ]* 16.1 Write property test for plan generation
  - **Property 3: Plan generation consistency**
  - **Validates: Requirements 2.1**
  - Generate random natural language queries
  - Verify agent generates plan with at least one step

- [ ]* 16.2 Write property test for code library usage
  - **Property 4: Code library usage**
  - **Validates: Requirements 2.3**
  - Generate various data analysis queries
  - Verify generated code imports pandas and/or plotly

- [ ] 17. Implement agent self-correction logic
  - Add analyze_error() method to ReasoningAgent
  - Implement execute_with_retry() with max 3 attempts
  - Parse error messages to identify root cause
  - Generate corrected code addressing specific errors
  - Track retry count in ExecutionResult
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 17.1 Write property test for error analysis and correction
  - **Property 6: Error analysis and correction**
  - **Validates: Requirements 3.1, 3.2**
  - Generate code with known error patterns
  - Verify agent generates different corrected code
  - Verify correction addresses the specific error

- [ ]* 17.2 Write property test for retry execution
  - **Property 7: Retry execution**
  - **Validates: Requirements 3.3**
  - Generate code that fails initially
  - Verify system re-executes corrected code

- [ ]* 17.3 Write unit tests for retry limits
  - Test retry stops after 3 attempts
  - Test error message shown after exhaustion
  - _Requirements: 3.4, 3.5_

## Phase 6: Query Processing API

- [ ] 18. Implement query processing endpoint
  - Create POST /api/query endpoint
  - Accept query text and session_id
  - Validate user authentication
  - Retrieve session and dataset schema
  - Pass query to reasoning agent
  - Return execution plan and results
  - _Requirements: 2.1, 2.2, 12.1_

- [ ]* 18.1 Write unit tests for query endpoint
  - Test query processing with valid session
  - Test query with invalid session
  - Test authentication validation
  - _Requirements: 2.1, 9.1_

- [ ] 19. Integrate PII scrubbing in query flow
  - Add PII scrubbing middleware before LLM calls
  - Scrub user query before sending to agent
  - Scrub error messages before sending to agent
  - Log all redactions to pii_redactions table
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ]* 19.1 Write property test for redaction audit logging
  - **Property 18: Redaction audit logging**
  - **Validates: Requirements 8.4**
  - Trigger PII redaction
  - Verify audit log entry is created

- [ ] 20. Implement execution result processing
  - Parse stdout/stderr from E2B sandbox
  - Extract Plotly figures from execution output
  - Create Artifact objects for code, charts, tables
  - Structure ExecutionResult response
  - _Requirements: 4.3, 5.1, 7.5_

- [ ]* 20.1 Write property test for output capture
  - **Property 9: Output capture**
  - **Validates: Requirements 4.3**
  - Generate code with stdout and stderr
  - Verify both are captured and displayed

- [ ]* 20.2 Write property test for execution result structure
  - **Property 16: Execution result structure**
  - **Validates: Requirements 7.5**
  - Execute various code samples
  - Verify response contains only stdout, stderr, artifacts

## Phase 7: Frontend UI Implementation

- [ ] 21. Implement main layout component
  - Create split-screen layout with resizable panels
  - Left panel: Chat interface (40% width)
  - Right panel: Workspace (60% width)
  - Add resize handle between panels
  - Make layout responsive for mobile
  - _Requirements: 10.1, 10.5_

- [ ]* 21.1 Write unit tests for layout component
  - Test initial layout rendering
  - Test panel resize functionality
  - _Requirements: 10.1_

- [ ] 22. Implement chat interface component
  - Create Chat component with message list
  - Implement message input with send button
  - Add loading indicator during query processing
  - Display user and assistant messages
  - Add timestamp to each message
  - Style with messenger-like appearance
  - _Requirements: 10.2, 2.1_

- [ ]* 22.1 Write unit tests for chat interface
  - Test message rendering
  - Test message sending
  - Test loading state
  - _Requirements: 10.2_

- [ ] 23. Implement workspace component
  - Create Workspace component with tab navigation
  - Implement Code tab with syntax highlighting
  - Implement Charts tab for visualizations
  - Add collapsible terminal log section
  - Show execution plan when available
  - _Requirements: 10.3, 4.1, 4.2, 2.2_

- [ ]* 23.1 Write property test for code visibility
  - **Property 8: Code visibility**
  - **Validates: Requirements 2.4, 4.1**
  - Generate various code samples
  - Verify code is displayed in workspace

- [ ]* 23.2 Write property test for artifact tab labeling
  - **Property 23: Artifact tab labeling**
  - **Validates: Requirements 10.3**
  - Generate artifacts of different types
  - Verify tabs are labeled "Code" and "Charts"

- [ ] 24. Implement code display component
  - Create CodeDisplay component
  - Add syntax highlighting with Prism or Highlight.js
  - Add copy-to-clipboard button
  - Show line numbers
  - Support Python syntax
  - _Requirements: 4.1_

- [ ] 25. Implement terminal log component
  - Create TerminalLog component
  - Style like VS Code terminal
  - Display stdout in white text
  - Display stderr in red text
  - Add expand/collapse toggle
  - Auto-scroll to bottom on new output
  - _Requirements: 4.2, 4.3, 4.4_

- [ ]* 25.1 Write unit tests for terminal log
  - Test stdout display
  - Test stderr display
  - Test expand/collapse functionality
  - _Requirements: 4.2, 4.4_

- [ ] 26. Implement chart visualization component
  - Install react-plotly.js
  - Create ChartDisplay component
  - Parse Plotly JSON from execution results
  - Render interactive Plotly charts
  - Enable zoom, pan, hover interactions
  - Handle multiple chart types (line, bar, scatter, etc.)
  - _Requirements: 5.1, 5.2_

- [ ]* 26.1 Write property test for visualization rendering
  - **Property 11: Visualization rendering**
  - **Validates: Requirements 5.1**
  - Generate various Plotly figures
  - Verify they render as interactive charts

- [ ] 27. Implement multi-artifact management
  - Add tab system for multiple visualizations
  - Create unique tab for each chart
  - Preserve chart state when switching tabs
  - Link each chart to its source code
  - _Requirements: 5.3, 5.4, 5.5_

- [ ]* 27.1 Write property test for multi-artifact organization
  - **Property 12: Multi-artifact organization**
  - **Validates: Requirements 5.3**
  - Generate multiple visualizations
  - Verify each is in a separate tab

- [ ]* 27.2 Write property test for artifact code pairing
  - **Property 13: Artifact code pairing**
  - **Validates: Requirements 5.5**
  - Generate visualizations
  - Verify underlying code is available in Code tab

- [ ]* 27.3 Write unit tests for tab state preservation
  - Test switching between tabs
  - Verify chart state is preserved
  - _Requirements: 5.4_

## Phase 8: Session Management

- [ ] 28. Implement session API endpoints
  - Create GET /api/sessions to list user sessions
  - Create GET /api/sessions/{id} to retrieve session details
  - Create POST /api/sessions/{id}/restore to restore session
  - Create POST /api/sessions to create new session
  - Add authentication middleware to all endpoints
  - _Requirements: 9.2, 9.3, 9.4_

- [ ]* 28.1 Write unit tests for session endpoints
  - Test session creation
  - Test session listing
  - Test session retrieval
  - Test session restoration
  - _Requirements: 9.2, 9.3, 9.4_

- [ ] 29. Implement session persistence
  - Save messages to database after each query
  - Save execution logs to database
  - Save dataset schema to session
  - Include timestamps on all records
  - _Requirements: 9.2, 9.5_

- [ ]* 29.1 Write property test for session persistence
  - **Property 20: Session persistence**
  - **Validates: Requirements 9.2**
  - Complete analysis sessions
  - Verify session data is saved to database

- [ ]* 29.2 Write property test for session data completeness
  - **Property 22: Session data completeness**
  - **Validates: Requirements 9.5**
  - Store sessions in database
  - Verify all required fields are present

- [ ] 30. Implement session restoration
  - Fetch session data from database
  - Restore chat messages to UI
  - Restore generated artifacts
  - Recreate workspace state
  - Do not recreate sandbox (user starts fresh)
  - _Requirements: 9.4_

- [ ]* 30.1 Write property test for session restoration
  - **Property 21: Session restoration**
  - **Validates: Requirements 9.4**
  - Save sessions with messages and artifacts
  - Restore sessions
  - Verify all data is present

- [ ] 31. Implement session history UI
  - Create SessionList component
  - Display list of previous sessions
  - Show session date, query count, dataset name
  - Add click handler to restore session
  - Add delete session functionality
  - _Requirements: 9.3_

- [ ]* 31.1 Write unit tests for session history UI
  - Test session list rendering
  - Test session selection
  - Test session deletion
  - _Requirements: 9.3_

- [ ] 32. Implement execution history tracking
  - Store all code executions in session
  - Track retry count for each execution
  - Display execution history in UI
  - Allow users to view previous code/results
  - _Requirements: 4.5_

- [ ]* 32.1 Write property test for execution history
  - **Property 10: Execution history**
  - **Validates: Requirements 4.5**
  - Execute multiple code blocks
  - Verify all are stored and retrievable

## Phase 9: Error Handling and Edge Cases

- [ ] 33. Implement comprehensive error handling
  - Add try-catch blocks to all API endpoints
  - Create standardized error response format
  - Implement error logging with request IDs
  - Add user-friendly error messages
  - Handle file upload errors (size, type, corrupted)
  - Handle sandbox errors (creation, timeout, connection)
  - Handle LLM API errors (rate limit, timeout, invalid key)
  - _Requirements: 3.5, 11.5_

- [ ]* 33.1 Write unit tests for error scenarios
  - Test file upload errors
  - Test sandbox creation failures
  - Test API rate limit handling
  - Test authentication errors
  - _Requirements: 3.5, 11.4_

- [ ] 34. Implement frontend error boundaries
  - Add React error boundaries to main components
  - Display user-friendly error messages
  - Add retry buttons for recoverable errors
  - Log errors to monitoring service
  - _Requirements: 3.5_

- [ ] 35. Add input validation
  - Validate file types and sizes on frontend
  - Validate query length (max 10,000 chars)
  - Validate session IDs
  - Sanitize all user inputs
  - _Requirements: 1.1, 1.2_

## Phase 10: Security Hardening

- [ ] 36. Implement authentication middleware
  - Create auth middleware for FastAPI
  - Validate JWT tokens from Supabase
  - Extract user_id from token
  - Reject requests with invalid/expired tokens
  - _Requirements: 9.1_

- [ ]* 36.1 Write unit tests for authentication
  - Test valid token acceptance
  - Test invalid token rejection
  - Test expired token rejection
  - _Requirements: 9.1_

- [ ] 37. Implement rate limiting
  - Add rate limiting middleware
  - Limit: 100 requests/minute per user
  - Limit: 10 file uploads/hour per user
  - Limit: 50 code executions/hour per user
  - Return 429 status when exceeded
  - _Requirements: 11.4_

- [ ] 38. Add security headers
  - Configure CORS with specific origins
  - Add Content-Security-Policy header
  - Add X-Frame-Options header
  - Add X-Content-Type-Options header
  - _Requirements: 12.1_

- [ ] 39. Implement workspace data transparency
  - Show original unredacted data in workspace
  - Ensure redacted data sent to LLM
  - Add visual indicator when PII is redacted
  - _Requirements: 8.5_

- [ ]* 39.1 Write property test for workspace data transparency
  - **Property 19: Workspace data transparency**
  - **Validates: Requirements 8.5**
  - Generate data with PII
  - Verify workspace shows original
  - Verify LLM receives redacted version

## Phase 11: Testing and Quality Assurance

- [ ] 40. Set up testing infrastructure
  - Configure pytest for backend
  - Configure Jest for frontend
  - Set up test database
  - Create test fixtures and factories
  - Add code coverage reporting
  - _Requirements: All_

- [ ] 41. Implement property-based tests
  - Set up Hypothesis for Python
  - Configure 100 iterations per property test
  - Implement all 27 property tests from design
  - Tag each test with property number
  - _Requirements: All testable properties_

- [ ] 42. Write integration tests
  - Test complete upload → query → execution flow
  - Test error correction flow
  - Test session save and restore flow
  - Test multi-query stateful flow
  - _Requirements: 1.1-11.5_

- [ ] 43. Checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests
  - Run all integration tests
  - Fix any failing tests
  - Ensure code coverage > 80%
  - Ensure all tests pass, ask the user if questions arise.

## Phase 12: Deployment and DevOps

- [ ] 44. Set up environment configuration
  - Create .env.example files for frontend and backend
  - Document all required environment variables
  - Set up secrets in Vercel
  - Set up secrets in Railway/Render
  - _Requirements: 11.2_

- [ ]* 44.1 Write property test for unified API gateway
  - **Property 24: Unified API gateway**
  - **Validates: Requirements 11.1**
  - Make various LLM requests
  - Verify all go through OpenRouter

- [ ]* 44.2 Write property test for frontend-backend separation
  - **Property 27: Frontend-backend separation**
  - **Validates: Requirements 12.1**
  - Test data requests from frontend
  - Verify all go through REST API

- [ ] 45. Deploy backend to Railway/Render
  - Create Dockerfile for FastAPI app
  - Configure build settings
  - Set up environment variables
  - Deploy to staging environment
  - Test all endpoints
  - Deploy to production
  - _Requirements: 12.5_

- [ ] 46. Deploy frontend to Vercel
  - Connect GitHub repository to Vercel
  - Configure build settings
  - Set up environment variables
  - Deploy to staging
  - Test all pages and functionality
  - Deploy to production
  - _Requirements: 12.5_

- [ ] 47. Set up monitoring and logging
  - Configure structured logging
  - Set up error tracking (Sentry or similar)
  - Configure performance monitoring
  - Set up alerts for errors and latency
  - Create dashboard for key metrics
  - _Requirements: All_

- [ ] 48. Final checkpoint - End-to-end testing
  - Test complete user flow in production
  - Upload sample datasets
  - Run various queries
  - Test error scenarios
  - Verify session persistence
  - Test authentication flow
  - Ensure all tests pass, ask the user if questions arise.

## Phase 13: Documentation and Polish

- [ ] 49. Create user documentation
  - Write README with setup instructions
  - Document API endpoints
  - Create user guide for data analysis
  - Add troubleshooting section
  - _Requirements: All_

- [ ] 50. Add loading states and animations
  - Add skeleton loaders for data fetching
  - Add smooth transitions between states
  - Add progress indicators for long operations
  - Polish UI with micro-interactions
  - _Requirements: 10.1, 10.2_

- [ ] 51. Optimize performance
  - Implement caching for dataset schemas
  - Optimize database queries
  - Add lazy loading for session history
  - Minimize bundle size
  - _Requirements: All_

- [ ] 52. Final review and cleanup
  - Remove console.logs and debug code
  - Clean up unused imports
  - Format code with prettier/black
  - Review and update comments
  - Final security audit
  - _Requirements: All_
