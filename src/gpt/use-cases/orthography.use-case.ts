import OpenAI from 'openai';
interface Options {
  prompt: string;

}

export const orthographyCheckUseCase = async (openai: OpenAI, options: Options) => {

  try {
    const { prompt } = options;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          Te serán proporcionados textos con posibles errores ortográficos y gramáticales.
          Tu tarea es revisar esos textos y retornar las correcciones que sean necesarias. 
          También debes dar un porcentajes de acierto. Debes de responder en formato JSON.
          Si no hay errores de ningún tipo, felicita al usuario.

          Ejemplo de respuesta:

          {
            userScore: number,
            errors: string[], // ['error -> correción'],
            message: string // Utiliza varios emojis y texto para felicitar al usuario por su redacción.
          }
        `
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      max_tokens: 150,
    });

    const jsonResponse = JSON.parse(completion.choices[0].message.content);

    return jsonResponse;
  } catch (error) {
    console.error('Error al procesar la respuesta JSON:', error);
    // Puedes manejar el error según sea necesario
    throw error; // O puedes retornar un valor predeterminado, dependiendo de tus necesidades
  }
};
