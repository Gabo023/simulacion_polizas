export class ClientRepository {
    async create(client) {
        throw new Error(
            "El método create(client) debe ser implementado"
        );
    }

    async findById(id) {
        throw new Error(
            "El método findById(id) debe ser implementado"
        );
    }

    async findByIdentification(identification) {
        throw new Error(
            "El método findByIdentification(identification) debe ser implementado"
        );
    }

    async findByEmail(email) {
        throw new Error(
            "El método findByEmail(email) debe ser implementado"
        );
    }

    async findAll({
        search = "",
        status = "",
        page = 1,
        limit = 10,
    } = {}) {
        throw new Error(
            "El método findAll(filters) debe ser implementado"
        );
    }

    async update(client) {
        throw new Error(
            "El método update(client) debe ser implementado"
        );
    }

    async delete(id) {
        throw new Error(
            "El método delete(id) debe ser implementado"
        );
    }
}