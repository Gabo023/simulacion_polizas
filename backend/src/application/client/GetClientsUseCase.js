export class GetClientsUseCase {
    constructor(clientRepository) {
        if (!clientRepository) {
            throw new Error(
                "GetClientsUseCase requiere un repositorio de clientes"
            );
        }

        this.clientRepository = clientRepository;
    }

    async execute({
        search = "",
        status = "",
        page = 1,
        limit = 10,
    } = {}) {
        const normalizedSearch =
            typeof search === "string" ? search.trim() : "";

        const normalizedStatus =
            typeof status === "string"
                ? status.trim().toUpperCase()
                : "";

        const normalizedPage = this.normalizePositiveInteger(page, 1);

        const normalizedLimit = Math.min(
            this.normalizePositiveInteger(limit, 10),
            100
        );

        const result = await this.clientRepository.findAll({
            search: normalizedSearch,
            status: normalizedStatus,
            page: normalizedPage,
            limit: normalizedLimit,
        });

        return {
            clients: result.clients.map((client) => client.toObject()),
            pagination: result.pagination,
            filters: {
                search: normalizedSearch,
                status: normalizedStatus,
            },
        };
    }

    normalizePositiveInteger(value, defaultValue) {
        const parsedValue = Number.parseInt(value, 10);

        if (!Number.isInteger(parsedValue) || parsedValue < 1) {
            return defaultValue;
        }

        return parsedValue;
    }
}