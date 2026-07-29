import { Client } from "../../domain/client/Client.js";

export class CreateClientUseCase {
    constructor(clientRepository) {
        if (!clientRepository) {
            throw new Error(
                "CreateClientUseCase requiere un repositorio de clientes"
            );
        }

        this.clientRepository = clientRepository;
    }

    async execute({
        identification,
        firstName,
        lastName,
        email,
        phone,
        address = null,
        hasPendingObligations = false,
    }) {
        const client = new Client({
            identification,
            firstName,
            lastName,
            email,
            phone,
            address,
            hasPendingObligations,
        });

        const clientWithSameIdentification =
            await this.clientRepository.findByIdentification(
                client.identification
            );

        if (clientWithSameIdentification) {
            throw new Error(
                "Ya existe un cliente registrado con esta identificación"
            );
        }

        const clientWithSameEmail =
            await this.clientRepository.findByEmail(client.email);

        if (clientWithSameEmail) {
            throw new Error(
                "Ya existe un cliente registrado con este correo electrónico"
            );
        }

        const createdClient = await this.clientRepository.create(client);

        return createdClient;
    }
}