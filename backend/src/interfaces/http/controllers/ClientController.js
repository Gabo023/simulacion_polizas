export class ClientController {
    constructor({
        createClientUseCase,
        getClientsUseCase,
        getClientByIdUseCase,
        updateClientUseCase,
        deleteClientUseCase,
    }) {
        if (!createClientUseCase) {
            throw new Error(
                "ClientController requiere CreateClientUseCase"
            );
        }

        if (!getClientsUseCase) {
            throw new Error(
                "ClientController requiere GetClientsUseCase"
            );
        }

        if (!getClientByIdUseCase) {
            throw new Error(
                "ClientController requiere GetClientByIdUseCase"
            );
        }

        if (!updateClientUseCase) {
            throw new Error(
                "ClientController requiere UpdateClientUseCase"
            );
        }

        if (!deleteClientUseCase) {
            throw new Error(
                "ClientController requiere DeleteClientUseCase"
            );
        }

        this.createClientUseCase = createClientUseCase;
        this.getClientsUseCase = getClientsUseCase;
        this.getClientByIdUseCase = getClientByIdUseCase;
        this.updateClientUseCase = updateClientUseCase;
        this.deleteClientUseCase = deleteClientUseCase;

        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req, res, next) {
        try {
            const client = await this.createClientUseCase.execute({
                identification: req.body.identification,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                hasPendingObligations:
                    req.body.hasPendingObligations,
            });

            return res.status(201).json({
                success: true,
                message: "Cliente creado correctamente",
                data: client.toObject(),
            });
        } catch (error) {
            return next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const result = await this.getClientsUseCase.execute({
                search: req.query.search,
                status: req.query.status,
                page: req.query.page,
                limit: req.query.limit,
            });

            return res.status(200).json({
                success: true,
                message: "Clientes obtenidos correctamente",
                data: result.clients,
                pagination: result.pagination,
                filters: result.filters,
            });
        } catch (error) {
            return next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const client = await this.getClientByIdUseCase.execute(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                message: "Cliente obtenido correctamente",
                data: client,
            });
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        try {
            const client = await this.updateClientUseCase.execute(
                req.params.id,
                {
                    identification: req.body.identification,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    hasPendingObligations:
                        req.body.hasPendingObligations,
                    status: req.body.status,
                }
            );

            return res.status(200).json({
                success: true,
                message: "Cliente actualizado correctamente",
                data: client,
            });
        } catch (error) {
            return next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const result = await this.deleteClientUseCase.execute(
                req.params.id
            );

            return res.status(200).json({
                success: result.success,
                message: result.message,
            });
        } catch (error) {
            return next(error);
        }
    }
}