# Requirements Document

## Introduction

DataLens is a verticalized data analysis agent that provides transparent, code-visible AI-powered data analysis. The system enables users to upload datasets, ask natural language questions, and receive answers through automatically generated and executed Python code. The core philosophy is "Trust through Transparency" - users can see and understand the code being executed rather than receiving opaque AI responses.

## Glossary

- **DataLens**: The complete data analysis agent system
- **Profiling Agent**: An AI component that analyzes dataset metadata without processing the full dataset
- **Reasoning Agent**: The primary AI agent that plans, generates code, and self-corrects to answer user queries
- **E2B Sandbox**: A Firecracker MicroVM-based isolated execution environment for running user-generated code
- **Workspace**: The right-side UI panel displaying code, charts, and execution artifacts
- **Chat Interface**: The left-side UI panel for natural language interaction
- **Session**: A user's active interaction period with persistent sandbox state
- **PII Scrubber**: A component that detects and redacts personally identifiable information
- **Reflexion**: The agent's self-correction capability when code execution fails

## Requirements

### Requirement 1

**User Story:** As a data analyst, I want to upload my dataset files, so that I can analyze them without manual data preparation.

#### Acceptance Criteria

1. WHEN a user drags and drops a CSV file onto the upload area, THEN DataLens SHALL accept the file and initiate processing
2. WHEN a user drags and drops an Excel file onto the upload area, THEN DataLens SHALL accept the file and initiate processing
3. WHEN DataLens receives a dataset file, THEN the Profiling Agent SHALL extract metadata from only the first 5 rows
4. WHEN the Profiling Agent processes a dataset, THEN DataLens SHALL generate a schema containing column names, data types, and value ranges
5. WHEN dataset metadata is extracted, THEN DataLens SHALL store only the schema and not persist the full dataset to disk permanently

### Requirement 2

**User Story:** As a data analyst, I want to ask questions about my data in natural language, so that I can get insights without writing code myself.

#### Acceptance Criteria

1. WHEN a user submits a natural language query, THEN the Reasoning Agent SHALL generate a multi-step analysis plan
2. WHEN the Reasoning Agent creates a plan, THEN DataLens SHALL display the plan steps to the user in the Workspace
3. WHEN a plan is generated, THEN the Reasoning Agent SHALL write Python code using pandas and plotly libraries to execute the plan
4. WHEN Python code is generated, THEN DataLens SHALL display the code in the Workspace before execution
5. WHEN code is ready for execution, THEN DataLens SHALL send the code to the E2B Sandbox for isolated execution

### Requirement 3

**User Story:** As a data analyst, I want the system to automatically fix code errors, so that I can get results without manual debugging.

#### Acceptance Criteria

1. WHEN the E2B Sandbox returns an execution error, THEN the Reasoning Agent SHALL analyze the error message and identify the root cause
2. WHEN an error is identified, THEN the Reasoning Agent SHALL generate corrected Python code addressing the specific error
3. WHEN corrected code is generated, THEN DataLens SHALL re-execute the code in the E2B Sandbox
4. WHEN error correction is attempted, THEN the Reasoning Agent SHALL retry up to 3 times before requesting user intervention
5. WHEN all retry attempts are exhausted, THEN DataLens SHALL display the final error message and request user guidance

### Requirement 4

**User Story:** As a data analyst, I want to see the code being executed, so that I can trust and understand the analysis process.

#### Acceptance Criteria

1. WHEN the Reasoning Agent generates code, THEN DataLens SHALL display the complete Python code in the Workspace
2. WHEN code is executing, THEN DataLens SHALL show a collapsible terminal log styled like a development environment
3. WHEN the E2B Sandbox returns output, THEN DataLens SHALL display both stdout and stderr in the terminal log
4. WHEN the terminal log is displayed, THEN DataLens SHALL allow users to expand or collapse the log view
5. WHEN multiple code executions occur, THEN DataLens SHALL maintain a history of all code and outputs in the Session

### Requirement 5

**User Story:** As a data analyst, I want to see interactive visualizations, so that I can explore patterns and trends in my data.

#### Acceptance Criteria

1. WHEN the Reasoning Agent generates a Plotly visualization, THEN DataLens SHALL render it as an interactive chart in the Workspace
2. WHEN a chart is rendered, THEN DataLens SHALL enable standard Plotly interactions including zoom, pan, and hover tooltips
3. WHEN multiple visualizations are generated, THEN DataLens SHALL display them in separate tabs within the Workspace
4. WHEN a user switches between tabs, THEN DataLens SHALL preserve the state of all visualizations
5. WHEN a visualization is displayed, THEN DataLens SHALL also provide the underlying code in a separate Code tab

### Requirement 6

**User Story:** As a data analyst, I want to ask follow-up questions about my analysis, so that I can iteratively explore my data.

#### Acceptance Criteria

1. WHEN a user submits a follow-up query, THEN the E2B Sandbox SHALL retain the previous execution state including loaded datasets
2. WHEN the E2B Sandbox maintains state, THEN DataLens SHALL keep the sandbox alive for 300 seconds after the last interaction
3. WHEN a follow-up query references previous results, THEN the Reasoning Agent SHALL access variables from prior executions
4. WHEN the Session timeout is reached, THEN DataLens SHALL terminate the E2B Sandbox and clear the execution state
5. WHEN a new Session begins, THEN DataLens SHALL create a fresh E2B Sandbox instance

### Requirement 7

**User Story:** As a system administrator, I want all code execution isolated from the backend server, so that malicious code cannot compromise the system.

#### Acceptance Criteria

1. WHEN Python code is generated, THEN DataLens SHALL execute it exclusively within the E2B Sandbox
2. WHEN code execution is requested, THEN the Backend Server SHALL not execute any user-generated code directly
3. WHEN the E2B Sandbox executes code, THEN DataLens SHALL prevent access to the Backend Server filesystem
4. WHEN the E2B Sandbox executes code, THEN DataLens SHALL prevent network access to internal services
5. WHEN a sandbox execution completes, THEN DataLens SHALL return only stdout, stderr, and generated artifacts to the Backend Server

### Requirement 8

**User Story:** As a compliance officer, I want personally identifiable information automatically redacted, so that sensitive data is not exposed to external AI services.

#### Acceptance Criteria

1. WHEN any text is sent to the LLM, THEN the PII Scrubber SHALL scan for email addresses and replace them with placeholder tokens
2. WHEN any text is sent to the LLM, THEN the PII Scrubber SHALL scan for phone numbers and replace them with placeholder tokens
3. WHEN data snippets are included in error messages, THEN the PII Scrubber SHALL redact PII before sending to the Reasoning Agent
4. WHEN the PII Scrubber detects sensitive information, THEN DataLens SHALL log the redaction event for audit purposes
5. WHEN redacted data is displayed to users, THEN DataLens SHALL show the original unredacted values in the Workspace

### Requirement 9

**User Story:** As a user, I want to authenticate and save my analysis sessions, so that I can return to previous work.

#### Acceptance Criteria

1. WHEN a user accesses DataLens, THEN the System SHALL require authentication via Supabase
2. WHEN a user completes an analysis, THEN DataLens SHALL save the Session history to the Database
3. WHEN a user logs in, THEN DataLens SHALL display a list of previous Sessions
4. WHEN a user selects a previous Session, THEN DataLens SHALL restore the chat history and generated artifacts
5. WHEN Session data is stored, THEN DataLens SHALL include timestamps, queries, code, and visualization metadata

### Requirement 10

**User Story:** As a user, I want a clean and intuitive interface, so that I can focus on analysis rather than navigation.

#### Acceptance Criteria

1. WHEN DataLens loads, THEN the System SHALL display a split-screen layout with Chat Interface on the left and Workspace on the right
2. WHEN the user interacts with the Chat Interface, THEN DataLens SHALL provide a messenger-style conversation view
3. WHEN artifacts are generated, THEN the Workspace SHALL organize them in tabs labeled Code and Charts
4. WHEN the interface renders, THEN DataLens SHALL use Shadcn UI components for consistent professional styling
5. WHEN the user resizes the browser window, THEN DataLens SHALL maintain responsive layout proportions

### Requirement 11

**User Story:** As a developer, I want the system to use a unified API gateway for AI models, so that model selection is flexible and configuration is simplified.

#### Acceptance Criteria

1. WHEN AI model access is required, THEN DataLens SHALL use OpenRouter API as the unified gateway for all LLM requests
2. WHEN the OpenRouter API key is configured, THEN DataLens SHALL store it securely as an environment variable
3. WHEN the Reasoning Agent generates code, THEN DataLens SHALL use the smolagents framework for agent orchestration
4. WHEN API calls are made, THEN DataLens SHALL handle rate limits and retry with exponential backoff
5. WHEN API errors occur, THEN DataLens SHALL display user-friendly error messages without exposing API keys

### Requirement 12

**User Story:** As a developer, I want clear separation between frontend and backend, so that the system is maintainable and scalable.

#### Acceptance Criteria

1. WHEN the Frontend needs data, THEN the System SHALL communicate with the Backend exclusively via REST API endpoints
2. WHEN the Backend processes requests, THEN the System SHALL use FastAPI framework with Python
3. WHEN the Frontend renders pages, THEN the System SHALL use Next.js 14 with App Router architecture
4. WHEN UI components are needed, THEN the Frontend SHALL use Tailwind CSS and Shadcn UI libraries
5. WHEN the system is deployed, THEN the Frontend SHALL run on Vercel and the Backend SHALL run on Railway or Render
