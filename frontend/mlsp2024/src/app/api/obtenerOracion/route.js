import dbConnect from '../../db/mongoose';
import Evaluation from '../../db/models/Evaluation'; // Adjust the path as necessary

export async function POST(req) { // This should be GET but nginx It's caching response
    const db = await dbConnect(); // Ensures that the database connection is established

    try {
        const [sentence] = await Evaluation.aggregate([
            { $sample: { size: 1 } }
        ]);
        
        if (!sentence) {
            return Response.json({ success: false, message: 'No evaluation found' }, {status:404})
        }

        const respuesta = Response.json({
            sucess: true,
            data: sentence
        })
        
        return respuesta;

    } catch (error) {
        console.error('Failed to save evaluation:', error);
        Response.json({ success: false, error: 'Failed to save evaluation' }, {status:500});
    }
}