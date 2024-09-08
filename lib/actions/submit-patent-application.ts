'use server';

import Groq from 'groq-sdk';
import { FormData } from '@/components/patent-application-form';

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function submitPatentApplication(formData: FormData) {
	const prompt = generatePrompt(formData);

	try {
		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are a patent expert assistant providing insights on patent ability and suggestions for patent applications.',
				},
				{ role: 'user', content: prompt },
			],
			model: 'mixtral-8x7b-32768',
			temperature: 0.5,
			max_tokens: 2048,
		});

		const report =
			completion.choices[0]?.message?.content || 'Unable to generate report.';

		return {
			success: true,
			message: 'Patent application submitted successfully!',
			report: report,
		};
	} catch (error) {
		console.error('Error generating report:', error);
		return {
			success: false,
			message: 'An error occurred while processing your application.',
			report: null,
		};
	}
}

function generatePrompt(formData: FormData): string {
	return `
Based on the following information about a potential patent application, provide a comprehensive assessment of the invention's patentability and suggestions for the application process:

1. Invention Stage: ${formData.inventionStage}
2. Prior Art Search: ${formData.priorArtSearch}
3. Novelty: ${formData.novelty}
4. Public Disclosure: ${formData.publicDisclosure ? 'Yes' : 'No'}
5. Patent Goals: ${formData.patentGoals.join(', ')}${
		formData.otherGoal ? ` (Other: ${formData.otherGoal})` : ''
	}
6. Protection Regions: ${formData.protectionRegions}
7. Timeline: ${formData.timeline}
8. Budget: ${formData.budget}
9. Disclosure Process Familiarity: ${formData.disclosureProcessFamiliarity}
10. Need Disclosure Explanation: ${
		formData.needDisclosureExplanation ? 'Yes' : 'No'
	}
11. Need Disclosure Assistance: ${
		formData.needDisclosureAssistance ? 'Yes' : 'No'
	}
12. Need Confidentiality Agreement: ${
		formData.needConfidentialityAgreement ? 'Yes' : 'No'
	}

Please provide:
1. An assessment of the invention's patentability based on the provided information.
2. Potential challenges or concerns regarding the patent application.
3. Suggestions for strengthening the patent application.
4. Recommendations for next steps in the patent application process.
5. Any additional insights or considerations based on the provided information.

Please structure your response in clear sections with headings for each of the above points.`;
}
