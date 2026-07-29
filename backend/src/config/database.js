import { Sequelize } from "sequelize";
import { env } from "./env.js";

export const sequelize = new Sequelize(
    env.database.name,
    env.database.user,
    env.database.password,
    {
        host: env.database.host,
        port: env.database.port,
        dialect: env.database.dialect,
        logging: env.database.logging ? console.log : false,

        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
        },

        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export async function connectDatabase() {
    try {
        await sequelize.authenticate();

        console.log("Conexión a PostgreSQL establecida correctamente");
        console.log(
            `Base de datos: ${env.database.name} | Host: ${env.database.host}:${env.database.port}`
        );
    } catch (error) {
        console.error("No se pudo conectar a PostgreSQL");
        console.error(error.message);

        throw error;
    }
}

export async function synchronizeDatabase() {
    try {
        await sequelize.sync({
            alter: env.nodeEnv === "development",
        });

        console.log("Modelos sincronizados correctamente con PostgreSQL");
    } catch (error) {
        console.error("No se pudieron sincronizar los modelos");
        console.error(error.message);

        throw error;
    }
}

export async function closeDatabase() {
    try {
        await sequelize.close();
        console.log("Conexión a PostgreSQL cerrada correctamente");
    } catch (error) {
        console.error("Error al cerrar la conexión a PostgreSQL");
        console.error(error.message);
    }
}