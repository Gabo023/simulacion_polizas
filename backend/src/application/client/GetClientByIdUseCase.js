export class GetClientByIdUseCase {
    constructor(clientRepository) {
        if (!clientRepository) {
            throw new Error(
                "GetClientByIdUseCase requiere un repositorio de clientes"
            );
        }

        this.clientRepository = clientRepository;
    }

    async execute(id) {
        const normalizedId = this.validateId(id);

        const client = await this.clientRepository.findById(
            normalizedId
        );

        if (!client) {
            throw new Error("Cliente no encontrado");
        }

        return client.toObject();
    }

    validateId(id) {
        if (typeof id !== "string") {
            throw new Error("El identificador del cliente es obligatorio");
        }

        const normalizedId = id.trim();

        if (!normalizedId) {
            throw new Error("El identificador del cliente es obligatorio");
        }

        const uuidPattern =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!uuidPattern.test(normalizedId)) {
            throw new Error(
                "El identificador del cliente no tiene un formato válido"
            );
        }

        return normalizedId;
    }
}