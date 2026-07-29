import { sequelize } from "./config/database.js";
import { DeleteClientUseCase } from "./application/client/DeleteClientUseCase.js";
import { SequelizeClientRepository } from "./infrastructure/repositories/SequelizeClientRepository.js";

const repository = new SequelizeClientRepository();

const deleteClientUseCase =
    new DeleteClientUseCase(repository);

async function testDeleteClientUseCase() {
    try {
        await sequelize.authenticate();

        const clientId =
            "b2cc0020-809d-4d4b-8716-0232b635e11a";

        const result =
            await deleteClientUseCase.execute(clientId);

        console.log(result);
    } catch (error) {
        console.error(error.message);
    } finally {
        await sequelize.close();
    }
}

testDeleteClientUseCase();