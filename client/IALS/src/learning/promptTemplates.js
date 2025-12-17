// src/learning/promptTemplates.js

export function getTeachingPrompt({ content, mode }) {
  if (!content) return "";

  switch (mode) {
    case "simplify":
      return `
Let's slow down and simplify this topic.

Here is the core idea explained step by step:

${content}

Try to understand the intuition first. No pressure.
`;

    case "deepen":
      return `
You're doing well — let's go deeper.

Here is a more detailed explanation with reasoning and edge cases:

${content}

Think about why this works and where it is applied.
`;

    case "clarify":
    default:
      return `
Let's clarify the concept clearly.

Here is a concise explanation:

${content}

Read carefully and make sure each step makes sense.
`;
  }
}
