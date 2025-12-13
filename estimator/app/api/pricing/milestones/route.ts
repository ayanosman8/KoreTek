import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter, MODELS } from '@/lib/ai/openrouter';

export async function POST(request: NextRequest) {
  try {
    const { totalPrice, milestones } = await request.json();

    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json(
        { error: 'Valid total price is required' },
        { status: 400 }
      );
    }

    if (!milestones || milestones.length === 0) {
      return NextResponse.json(
        { error: 'Milestones are required' },
        { status: 400 }
      );
    }

    // Build prompt for AI to suggest milestone payment breakdown
    const systemPrompt = `You are a pricing consultant for software development projects. Your task is to suggest a fair and logical payment breakdown across project milestones.

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanatory text.

Guidelines:
- Milestone payments should reflect the complexity and effort of each phase
- Early milestones (discovery/planning) typically get 15-25% of total
- Development/implementation milestones get 50-60% of total
- Testing/deployment milestones get 15-25% of total
- All milestone payments MUST add up EXACTLY to the total project price
- Consider the milestone duration and deliverables when allocating payment

Return a JSON array with payment amounts for each milestone in order.

Example response format:
[5000, 15000, 5000]`;

    const userPrompt = `Total Project Price: $${totalPrice.toLocaleString()}

Milestones:
${milestones.map((m: any, i: number) => `${i + 1}. ${m.name} (${m.duration})
   Deliverables: ${m.deliverables}`).join('\n\n')}

Suggest payment amounts for each milestone that add up to exactly $${totalPrice.toLocaleString()}.`;

    const response = await callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      {
        model: MODELS.CLAUDE_35_SONNET,
        temperature: 0.3,
        max_tokens: 500,
      }
    );

    // Clean and parse JSON response
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Extract JSON array
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON array. Raw response:', response);
      throw new Error('Failed to parse AI response');
    }

    const suggestedPayments: number[] = JSON.parse(jsonMatch[0]);

    // Validate that payments add up to total (allow for small rounding differences)
    const sum = suggestedPayments.reduce((a, b) => a + b, 0);
    const difference = Math.abs(sum - totalPrice);

    if (difference > 1) {
      // Adjust the last milestone to ensure exact total
      const adjustment = totalPrice - sum;
      suggestedPayments[suggestedPayments.length - 1] += adjustment;
    }

    return NextResponse.json({ payments: suggestedPayments });

  } catch (error: any) {
    console.error('Error generating milestone payments:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate milestone payments' },
      { status: 500 }
    );
  }
}
