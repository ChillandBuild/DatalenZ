import os
import re
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """You are a polite and expert Data Science Assistant.
You are given a dataset file path (usually '/home/user/dataset.csv') and a user question.
Your goal is to write PYTHON CODE to analyze the data and answer the question.

RULES:
1. Use `pandas` for data manipulation.
2. Use `plotly` for visualization (if asked for charts).
3. When using plotly, show the figure using `fig.show()`.
4. Print the final textual answer to stdout using `print()`.
5. The dataset is located at: {file_path}
6. Do NOT guess column names. Use the provided column info.
7. Wrap your entire code in a markdown block: ```python ... ```
8. Keep code simple and self-contained.
"""

class AgentService:
    def __init__(self):
        base_url = "https://openrouter.ai/api/v1"
        api_key = os.environ.get("OPENROUTER_API_KEY")
        self.model = os.environ.get("LLM_MODEL", "google/gemini-2.0-flash-exp")
        
        if not api_key:
            print("Warning: OPENROUTER_API_KEY not set.")
            self.client = None
        else:
            self.client = OpenAI(
                base_url=base_url,
                api_key=api_key,
            )

    def generate_code(self, query: str, file_path: str, columns: str) -> str:
        """Generates Python code based on the user query and dataset context."""
        if not self.client:
            raise ValueError("LLM client not initialized")

        formatted_system_prompt = SYSTEM_PROMPT.format(file_path=file_path)
        
        user_message = f"""
Dataset Columns: {columns}
User Question: {query}

Write the Python code to solve this.
"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": formatted_system_prompt},
                    {"role": "user", "content": user_message}
                ]
            )
            
            content = response.choices[0].message.content
            return self._extract_code(content)
            
        except Exception as e:
            print(f"LLM Error: {e}")
            raise e

    def _extract_code(self, text: str) -> str:
        """Extracts python code from markdown blocks."""
        match = re.search(r"```python\s*(.*?)```", text, re.DOTALL)
        if match:
            return match.group(1).strip()
        
        # Fallback: check for just ```
        match = re.search(r"```\s*(.*?)```", text, re.DOTALL)
        if match:
            return match.group(1).strip()
            
        # Fallback: assume the whole text is code if it looks like it
        if "import pandas" in text or "print(" in text:
            return text
            
        return ""
