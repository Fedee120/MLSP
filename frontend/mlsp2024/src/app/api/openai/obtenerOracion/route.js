import OpenAI from "openai"

export async function GET(request){
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
        messages: [
            { role: "user", content: 
            `
            Genera una oración creativa que incluya al menos una palabra que enriquezca significativamente su contenido. La oración debe ser no trivial. Proporciona tu respuesta en formato JSON, especificando la oración y destacando una palabra que consideres que añade profundidad a su significado. Aquí tienes un ejemplo de cómo debería ser la respuesta:
            {
               'oracion': 'Ejemplo de oración generada aquí',
               'seleccionada': 'palabraDestacada'
            }
            Intenta que cada oración sea única y la palabra destacada varíe en cada generación.
             `
            }],
        max_tokens: 80,
        temperature: 1.2,
    });
    // parsea la respuesta que obtenemos en formato json
    const respuesta = JSON.parse(completion.choices[0].message.content)

    // el zaraza del sabor
    return Response.json(respuesta)

}

/*
            Genera una oración aleatoria.
             Para esta oración selecciona una palabra que no sea un stop-word. Responderas en modo JSON en el siguiente formato 
             {
                "oracion": "[ORACION]", 
                "seleccionada": "[PALABRA]"
             }
*/