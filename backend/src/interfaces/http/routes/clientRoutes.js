import { Router } from "express";

import { CreateClientUseCase } from "../../../application/client/CreateClientUseCase.js";
import { DeleteClientUseCase } from "../../../application/client/DeleteClientUseCase.js";
import { GetClientByIdUseCase } from "../../../application/client/GetClientByIdUseCase.js";
import { GetClientsUseCase } from "../../../application/client/GetClientsUseCase.js";
import { UpdateClientUseCase } from "../../../application/client/UpdateClientUseCase.js";

import { SequelizeClientRepository } from "../../../infrastructure/repositories/SequelizeClientRepository.js";

import { ClientController } from "../controllers/ClientController.js";

const clientRouter = Router();

const clientRepository = new SequelizeClientRepository();

const createClientUseCase = new CreateClientUseCase(
    clientRepository
);

const getClientsUseCase = new GetClientsUseCase(
    clientRepository
);

const getClientByIdUseCase = new GetClientByIdUseCase(
    clientRepository
);

const updateClientUseCase = new UpdateClientUseCase(
    clientRepository
);

const deleteClientUseCase = new DeleteClientUseCase(
    clientRepository
);

const clientController = new ClientController({
    createClientUseCase,
    getClientsUseCase,
    getClientByIdUseCase,
    updateClientUseCase,
    deleteClientUseCase,
});

clientRouter.post("/", clientController.create);

clientRouter.get("/", clientController.getAll);

clientRouter.get("/:id", clientController.getById);

clientRouter.put("/:id", clientController.update);

clientRouter.patch("/:id", clientController.update);

clientRouter.delete("/:id", clientController.delete);

export { clientRouter };