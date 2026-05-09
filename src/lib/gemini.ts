import { GoogleGenAI } from '@google/genai';

// Initialize the API client
// It uses process.env.GEMINI_API_KEY injected by the AI Studio environment
const ai = new GoogleGenAI({});

export async function analyzeLetterRequirements(userInput: string, letterType: string) {
  try {
    const prompt = `Analyze this user request for a "${letterType}" letter.
User description: "${userInput}"

What specific additional details (names, dates, addresses, reasons, document numbers, etc.) are absolutely required to make this Indian official letter complete?

Return ONLY a JSON object with this shape:
{
  "missingFields": ["list of short labels for missing fields, e.g. 'Bank Account Number'"],
  "analysis": "A brief sentence explaining what needs to be added."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { missingFields: [], analysis: "Provide any additional context needed." };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { missingFields: [], analysis: "Failed to query AI for requirements." };
  }
}

export async function generateLetter(allDetails: any, language: string) {
  try {
    const prompt = `Write a formal ${allDetails.letterType || 'Government'} letter in ${language} language.

Sender Details:
Name: ${allDetails.senderName}
Address: ${allDetails.senderAddress}
Mobile: ${allDetails.senderMobile}
Date: ${allDetails.date}

Recipient:
${allDetails.recipientDesignation}, ${allDetails.recipientDepartment}
${allDetails.recipientAddress}

User's requirement (in their own words):
${allDetails.description}

Additional details provided:
${JSON.stringify(allDetails.additionalFields, null, 2)}

Requirements:
1. Follow Indian government letter format strictly
2. Use formal, respectful language appropriate for ${language}
3. Include proper subject line
4. Keep paragraphs clear and concise
5. End with appropriate closing ("Yours faithfully/sincerely")
6. If Hindi/regional language, use proper formal script
7. The letter should be complete and ready to submit
8. Include "Enclosures:" section if documents are likely needed
9. Do not include markdown blocks, just the plain text formatted correctly. Start directly with the Date/Place or To section.

Return ONLY the letter text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Using flash for speed as requested
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating letter. Please check your API key or try again later.";
  }
}
