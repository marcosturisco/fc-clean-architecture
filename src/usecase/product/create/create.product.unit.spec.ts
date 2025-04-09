import CreateProductUseCase from "./create.product.usecase";

const input = {
    type: "a",
    name: "Product A",
    price: 10
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
};

describe("Unit test create product use case", () => {
    it("should create a type 'a' product", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const output = await productCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            type: input.type,
            name: input.name,
            price: input.price
        });
    });

    it("should create a type 'b' product", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        input.type = "b";

        const output = await productCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            type: input.type,
            name: input.name,
            price: (input.price * 2)
        });
    });

    it("should thrown an error when product has a invalid type", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        input.type = "c";

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            "Product type not supported"
        );
    });
});