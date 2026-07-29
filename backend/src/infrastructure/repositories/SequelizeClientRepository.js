import { Op } from "sequelize";

import { Client } from "../../domain/client/Client.js";
import { ClientRepository } from "../../domain/client/ClientRepository.js";
import { ClientModel } from "../database/models/ClientModel.js";

export class SequelizeClientRepository extends ClientRepository {
    async create(client) {
        const createdClient = await ClientModel.create({
            identification: client.identification,
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            phone: client.phone,
            address: client.address,
            hasPendingObligations: client.hasPendingObligations,
            status: client.status,
        });

        return this.toDomain(createdClient);
    }

    async findById(id) {
        const clientModel = await ClientModel.findByPk(id);

        if (!clientModel) {
            return null;
        }

        return this.toDomain(clientModel);
    }

    async findByIdentification(identification) {
        const normalizedIdentification =
            Client.normalizeIdentification(identification);

        const clientModel = await ClientModel.findOne({
            where: {
                identification: normalizedIdentification,
            },
        });

        if (!clientModel) {
            return null;
        }

        return this.toDomain(clientModel);
    }

    async findByEmail(email) {
        const normalizedEmail = Client.normalizeEmail(email);

        const clientModel = await ClientModel.findOne({
            where: {
                email: normalizedEmail,
            },
        });

        if (!clientModel) {
            return null;
        }

        return this.toDomain(clientModel);
    }

    async findAll({
        search = "",
        status = "",
        page = 1,
        limit = 10,
    } = {}) {
        const normalizedPage = this.normalizePositiveInteger(page, 1);
        const normalizedLimit = Math.min(
            this.normalizePositiveInteger(limit, 10),
            100
        );

        const offset = (normalizedPage - 1) * normalizedLimit;

        const where = {};

        if (status) {
            where.status = Client.validateStatus(status);
        }

        if (typeof search === "string" && search.trim()) {
            const normalizedSearch = search.trim();

            where[Op.or] = [
                {
                    identification: {
                        [Op.iLike]: `%${normalizedSearch}%`,
                    },
                },
                {
                    firstName: {
                        [Op.iLike]: `%${normalizedSearch}%`,
                    },
                },
                {
                    lastName: {
                        [Op.iLike]: `%${normalizedSearch}%`,
                    },
                },
                {
                    email: {
                        [Op.iLike]: `%${normalizedSearch}%`,
                    },
                },
                {
                    phone: {
                        [Op.iLike]: `%${normalizedSearch}%`,
                    },
                },
            ];
        }

        const { count, rows } = await ClientModel.findAndCountAll({
            where,
            order: [
                ["createdAt", "DESC"],
                ["lastName", "ASC"],
                ["firstName", "ASC"],
            ],
            limit: normalizedLimit,
            offset,
        });

        const totalPages =
            count === 0 ? 0 : Math.ceil(count / normalizedLimit);

        return {
            clients: rows.map((row) => this.toDomain(row)),
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: normalizedPage,
                pageSize: normalizedLimit,
                hasPreviousPage: normalizedPage > 1,
                hasNextPage: normalizedPage < totalPages,
            },
        };
    }

    async update(client) {
        if (!client.id) {
            throw new Error(
                "No se puede actualizar un cliente sin identificador"
            );
        }

        const clientModel = await ClientModel.findByPk(client.id);

        if (!clientModel) {
            return null;
        }

        await clientModel.update({
            identification: client.identification,
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            phone: client.phone,
            address: client.address,
            hasPendingObligations: client.hasPendingObligations,
            status: client.status,
        });

        return this.toDomain(clientModel);
    }

    async delete(id) {
        const deletedRows = await ClientModel.destroy({
            where: {
                id,
            },
        });

        return deletedRows > 0;
    }

    toDomain(clientModel) {
        const data = clientModel.get({
            plain: true,
        });

        return new Client({
            id: data.id,
            identification: data.identification,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            hasPendingObligations: data.hasPendingObligations,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    normalizePositiveInteger(value, defaultValue) {
        const parsedValue = Number.parseInt(value, 10);

        if (!Number.isInteger(parsedValue) || parsedValue < 1) {
            return defaultValue;
        }

        return parsedValue;
    }
}