import { Client } from "../../domain/client/Client.js";

export class UpdateClientUseCase {
    constructor(clientRepository) {
        if (!clientRepository) {
            throw new Error(
                "UpdateClientUseCase requiere un repositorio de clientes"
            );
        }

        this.clientRepository = clientRepository;
    }

    async execute(
        id,
        {
            identification,
            firstName,
            lastName,
            email,
            phone,
            address,
            hasPendingObligations,
            status,
        } = {}
    ) {
        const normalizedId = this.validateId(id);

        const existingClient =
            await this.clientRepository.findById(normalizedId);

        if (!existingClient) {
            throw new Error("Cliente no encontrado");
        }

        const updatedClient = new Client({
            id: existingClient.id,
            identification:
                identification ?? existingClient.identification,
            firstName: firstName ?? existingClient.firstName,
            lastName: lastName ?? existingClient.lastName,
            email: email ?? existingClient.email,
            phone: phone ?? existingClient.phone,
            address:
                address === undefined
                    ? existingClient.address
                    : address,
            hasPendingObligations:
                hasPendingObligations ??
                existingClient.hasPendingObligations,
            status: status ?? existingClient.status,
            createdAt: existingClient.createdAt,
            updatedAt: existingClient.updatedAt,
        });

        await this.validateIdentificationAvailability(
            updatedClient.identification,
            existingClient.id
        );

        await this.validateEmailAvailability(
            updatedClient.email,
            existingClient.id
        );

        const savedClient =
            await this.clientRepository.update(updatedClient);

        if (!savedClient) {
            throw new Error("No se pudo actualizar el cliente");
        }

        return savedClient.toObject();
    }

    async validateIdentificationAvailability(
        identification,
        currentClientId
    ) {
        const clientWithSameIdentification =
            await this.clientRepository.findByIdentification(
                identification
            );

        if (
            clientWithSameIdentification &&
            clientWithSameIdentification.id !== currentClientId
        ) {
            throw new Error(
                "Ya existe otro cliente registrado con esta identificación"
            );
        }
    }

    async validateEmailAvailability(email, currentClientId) {
        const clientWithSameEmail =
            await this.clientRepository.findByEmail(email);

        if (
            clientWithSameEmail &&
            clientWithSameEmail.id !== currentClientId
        ) {
            throw new Error(
                "Ya existe otro cliente registrado con este correo electrónico"
            );
        }
    }

    validateId(id) {
        if (typeof id !== "string") {
            throw new Error(
                "El identificador del cliente es obligatorio"
            );
        }

        const normalizedId = id.trim();

        if (!normalizedId) {
            throw new Error(
                "El identificador del cliente es obligatorio"
            );
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