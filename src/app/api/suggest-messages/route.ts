import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export async function GET(request: Request){
    try{
        const { text } = await generateText({
            model: groq('gemma2-9b-it'),
            prompt: `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: message1||message2||message3`,
        });
        return Response.json(
            {
                success: true,
                message: "Suggested messages generated successfully",
                data: {
                    messages: text
                }
            },
            {
                status: 200
            }
        );
    }
    catch(err){
        return Response.json(
            {
                success: false,
                message: "Failed to generate suggested messages",
            },
            {
                status: 500
            }
        );
    }
}