import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test list products use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([ProductModel])
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list all products", async () => {
        const productRepository = new ProductRepository();
        const useCase = new ListProductUseCase(productRepository);

        const product1 = new Product("123", "Product A", 10);
        const product2 = new Product("456", "Product B", 20);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const output = {
            products: [
                {
                    id: "123",
                    name: "Product A",
                    price: 10
                },
                {
                    id: "456",
                    name: "Product B",
                    price: 20
                },
            ]
        };

        const result = await useCase.execute({});

        expect(result).toEqual(output);
    });
});