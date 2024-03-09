const md5 = require('md5');

const Groq = require("groq-sdk");


function getRandomPrompt(encodedDate) {
    const prompt1 = {
        model: "mixtral-8x7b-32768",
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: 
            `
            Lingua Simplify está diseñado específicamente para generar datos sintéticos en español, 
            enfocándose en la creación de oraciones diversas y la identificación de palabras clave para la evaluación de su complejidad. 
            La única salida de este GPT es un JSON que incluye la oración generada y la palabra seleccionada para evaluación. 
            Este GPT tiene una orientación creativa para producir oraciones que varíen en complejidad y contexto, 
            asegurando una amplia gama de ejemplos para análisis. 
            
            La comunicación es directa y al punto, centrada exclusivamente en la entrega de datos sintéticos requeridos.
            
            Este GPT no realizará ninguna otra tarea aparte de la generación de estos JSON. 
            La interacción se limitará a recibir solicitudes de generación de datos y responder con el formato JSON especificado, 
            sin desviarse hacia otras funciones o conversaciones.
            
            Ejemplo de salidas:
            {
                'oracion': 'Ejemplo de oración generada aquí',
                'seleccionada': 'palabraDestacada'
            }
             `
            },
            {
                role: "user",
                content: `${encodedDate}`
            }
        ],
        max_tokens: 80,
        temperature: 1.2,
    }

    const prompt2 = {
        model: "llama2-70b-4096",
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: 
            `
            Genera una oración creativa que incluya al menos una palabra que enriquezca significativamente su contenido. La oración debe ser no trivial. Proporciona tu respuesta en formato JSON, especificando la oración y destacando una palabra que consideres que añade profundidad a su significado. Aquí tienes un ejemplo de cómo debería ser la respuesta:
            {
               'oracion': 'Ejemplo de oración generada aquí',
               'seleccionada': 'palabraDestacada'
            }
            Intenta que cada oración sea única y la palabra destacada varíe en cada generación.
             `
            },
            {
                role: "user",
                content: `${encodedDate}`
            }
        ],
        max_tokens: 80,
        temperature: 0.9,
    };

    const randomPrompt = Math.random() < 0.5 ? prompt1 : prompt2;

    return randomPrompt;
}

export async function POST(request){
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const date = Date.now().toString();
    const encodedDate = md5(date).toString();
    const completion = await groq.chat.completions.create(getRandomPrompt(encodedDate));
    const respuesta = JSON.parse(completion.choices[0].message.content)

    // el zaraza del sabor
    return Response.json(respuesta)
}