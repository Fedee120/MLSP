import dbConnect from '../../db/mongoose';
import Evaluation from '../../db/models/Evaluation'; // Adjust the path as necessary

export async function POST(req) {
    await dbConnect(); // Ensures that the database connection is established

    const { oracion, palabraCompleja, evaluacion } = await req.json();

    // Ensure all required fields are provided
    if (!oracion || !palabraCompleja || evaluacion == null) {
        return new Response({message:"Omar, algo anda mal"}, {status: 400})
    }


    // try {
    // Create a new evaluation document
    const newEvaluation = new Evaluation({
    oracion,
    palabraCompleja,
    evaluacion,
    });

    // Save the document to the database
    const savedEvaluation = await newEvaluation.save();

    // Send back a success response
    const respuesta = Response.json({
        sucess: true,
        data: savedEvaluation
    })

    return respuesta;
        // res.status(201).json({ success: true, data: savedEvaluation });
    // } catch (error) {
    //     console.error('Failed to save evaluation:', error);
    //     res.status(500).json({ success: false, error: 'Failed to save evaluation' });
    // }

}
