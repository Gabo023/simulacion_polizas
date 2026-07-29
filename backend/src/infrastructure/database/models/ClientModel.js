import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

export class ClientModel extends Model { }

ClientModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        identification: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: {
                name: "clients_identification_unique",
                msg: "Ya existe un cliente con esta identificación",
            },
            validate: {
                notEmpty: {
                    msg: "La identificación es obligatoria",
                },
                len: {
                    args: [10, 20],
                    msg: "La identificación debe tener entre 10 y 20 caracteres",
                },
            },
        },

        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "first_name",
            validate: {
                notEmpty: {
                    msg: "Los nombres son obligatorios",
                },
                len: {
                    args: [2, 100],
                    msg: "Los nombres deben tener entre 2 y 100 caracteres",
                },
            },
        },

        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "last_name",
            validate: {
                notEmpty: {
                    msg: "Los apellidos son obligatorios",
                },
                len: {
                    args: [2, 100],
                    msg: "Los apellidos deben tener entre 2 y 100 caracteres",
                },
            },
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: {
                name: "clients_email_unique",
                msg: "Ya existe un cliente con este correo electrónico",
            },
            validate: {
                notEmpty: {
                    msg: "El correo electrónico es obligatorio",
                },
                isEmail: {
                    msg: "Debe ingresar un correo electrónico válido",
                },
            },
        },

        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El teléfono es obligatorio",
                },
                len: {
                    args: [7, 20],
                    msg: "El teléfono debe tener entre 7 y 20 caracteres",
                },
            },
        },

        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        hasPendingObligations: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "has_pending_obligations",
        },

        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            allowNull: false,
            defaultValue: "ACTIVE",
        },
    },
    {
        sequelize,
        modelName: "Client",
        tableName: "clients",

        indexes: [
            {
                name: "clients_identification_index",
                fields: ["identification"],
            },
            {
                name: "clients_email_index",
                fields: ["email"],
            },
            {
                name: "clients_status_index",
                fields: ["status"],
            },
        ],
    }
);