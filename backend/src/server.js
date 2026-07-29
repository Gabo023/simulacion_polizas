import app from "./app.js";
import { env } from "./config/env.js";
import {
    connectDatabase,
    synchronizeDatabase,
    closeDatabase,
} from "./config/database.js";

import { initializeModels } from "./infrastructure/database/models/index.js";

let server;

async function startServer() {
    try {
        initializeModels();

        await connectDatabase();
        await synchronizeDatabase();

        server = app.listen(env.port, () => {
            console.log(`Servidor ejecutándose en http://localhost:${env.port}`);
            console.log(
                `Estado de la API: http://localhost:${env.port}/api/health`
            );
            console.log(`Entorno: ${env.nodeEnv}`);
        });
    } catch (error) {
        console.error("No fue posible iniciar la aplicación");
        console.error(error.message);

        process.exit(1);
    }
}

async function shutdown(signal) {
    console.log(`\nSeñal ${signal} recibida. Cerrando aplicación...`);

    if (server) {
        server.close(async () => {
            console.log("Servidor HTTP cerrado correctamente");

            await closeDatabase();

            process.exit(0);
        });

        return;
    }

    await closeDatabase();
    process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();