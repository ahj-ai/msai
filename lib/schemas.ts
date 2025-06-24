import { Schema, SchemaType } from "@google/generative-ai";

export const solutionSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    problem: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: "A brief title identifying the type of problem (e.g., 'Solving a Quadratic Equation')."
        },
        statement: {
          type: SchemaType.STRING,
          description: "Restate the user's question clearly based on the image content. Use LaTeX for all mathematical components."
        },
        keyConcepts: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
            description: "A list of key concepts or formulas needed (e.g., 'Quadratic Formula')."
          }
        },
      },
      required: ["title", "statement", "keyConcepts"],
    },
    solution: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          step: {
            type: SchemaType.STRING,
            description: "State the action for this step (e.g., 'Identify coefficients a, b, and c')."
          },
          work: {
            type: SchemaType.STRING,
            description: "Show all mathematical work for this step, using LaTeX."
          },
          explanation: {
            type: SchemaType.STRING,
            description: "Explain the reasoning or rule being applied."
          },
        },
        required: ["step", "explanation", "work"],
      },
    },
    answer: {
      type: SchemaType.OBJECT,
      properties: {
        finalResult: {
          type: SchemaType.STRING,
          description: "State the final, simplified result, using LaTeX."
        },
        verification: {
          type: SchemaType.STRING,
          description: "Briefly explain how the answer could be verified."
        },
      },
      required: ["finalResult", "verification"],
    },
  },
  required: ["problem", "solution", "answer"],
};
