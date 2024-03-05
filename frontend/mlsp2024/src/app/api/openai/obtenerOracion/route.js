import OpenAI from "openai"

export async function GET(request){
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
        messages: [
            { role: "user", content: `
            Tu tarea es crear una oración interesante y desafiante. Dentro de esta oración, identifica una palabra, la oracion no debe ser trivial. Por favor, proporciona tu respuesta en el siguiente formato JSON, incluyendo tanto la oración completa como la palabra seleccionada:
            {
               "oracion": "Aqui va la oración generada",
               "seleccionada": "seleccion"
            }
            Asegúrate de que la palabra seleccionada realmente agregue riqueza al significado de la oración.
             `
            }],
        max_tokens: 80,
        temperature: 0.7,
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