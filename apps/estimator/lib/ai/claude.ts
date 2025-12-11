import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function generateRequirements(userInput: string) {
  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a technical requirements analyst. A client has submitted this project idea:

"${userInput}"

Generate a comprehensive project analysis including:

1. **Feature List**: Break down the core features needed
2. **User Flows**: Describe the main user journeys
3. **Database Schema**: Suggest tables and relationships
4. **Tech Stack**: Recommend appropriate technologies
5. **Estimated Timeline**: Provide rough time estimates
6. **Follow-up Questions**: List 5-10 clarifying questions to ask the client

Format your response as JSON with these keys: features, userFlows, databaseSchema, techStack, timeline, questions, estimatedCost`
      }
    ]
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

export { client as anthropicClient };
