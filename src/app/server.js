import app from './app.js';
import { env } from '../shared/config/env.js';
import { connectDB } from '../shared/config/db.js';

async function start() {
    try{
        await connectDB();
        app.listen(env.PORT, () => {
            console.log(`Server running on PORT: ${env.PORT}`);
        });
    }catch(err){
        console.error('Failed to start server: ', err);
        process.exit(1);
    }
}

start();