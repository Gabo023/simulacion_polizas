import cors from "cors";
import express from "express";

import { clientRouter } from "./interfaces/http/routes/clientRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message:
            "API de pólizas de inversión funcionando correctamente",
    });
});

app.get("/api/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Servidor funcionando correctamente",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/clients", clientRouter);

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
        path: req.originalUrl,
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    const statusCode = getErrorStatusCode(error);

    return res.status(statusCode).json({
        success: false,
        message:
            error.message ||
            "Ocurrió un error interno en el servidor",
    });
});

function getErrorStatusCode(error) {
    const message = error?.message?.toLowerCase() ?? "";

    if (
        message.includes("no encontrado") ||
        message.includes("no encontrada")
    ) {
        return 404;
    }

    if (
        message.includes("ya existe") ||
        message.includes("duplicado")
    ) {
        return 409;
    }

    if (
        message.includes("obligatorio") ||
        message.includes("formato válido") ||
        message.includes("formato invalido") ||
        message.includes("no es válido") ||
        message.includes("no es valido")
    ) {
        return 400;
    }

    return 500;
}

export default app;
