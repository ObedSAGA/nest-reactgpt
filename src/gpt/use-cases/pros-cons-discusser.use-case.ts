import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDiscusserUseCase = async (openai: OpenAI, { prompt }: Options) => {


    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                la respuesta debe de ser en formato markdown, los pros y contras deben de estar en una lista,
            `
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        max_tokens: 1500,
    });

    const mkdResponse = completion.choices[0].message;

    return mkdResponse;

}