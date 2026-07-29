import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
    "PORT",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "JWT_SECRET",
];

const missingEnvVariables = requiredEnvVariables.filter(
    (variable) => !process.env[variable]
);

if (missingEnvVariables.length > 0) {
    throw new Error(
        `Faltan variables de entorno obligatorias: ${missingEnvVariables.join(", ")}`
    );
}

const parseNumber = (value, variableName) => {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        throw new Error(
            `La variable de entorno ${variableName} debe ser un número válido`
        );
    }

    return parsedValue;
};

export const env = Object.freeze({
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseNumber(process.env.PORT, "PORT"),

    database: {
        host: process.env.DB_HOST,
        port: parseNumber(process.env.DB_PORT, "DB_PORT"),
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: "postgres",
        logging: process.env.DB_LOGGING === "true",
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    },
});