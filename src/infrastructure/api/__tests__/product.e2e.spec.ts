import request from "supertest";
import { app, sequelize } from "../express";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Product A",
                price: 10
            });

        expect(response.status).toBe(200);
    });

    it("should not create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product A",
                price: 10
            });

        expect(response.status).toBe(500);
    });

    it("should list all products", async () => {
        const response1 = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Product A",
                price: 10
            });

        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/product")
            .send({
                type: "b",
                name: "Product B",
                price: 20
            });

        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/product").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);

        const product1 = listResponse.body.products[0];

        expect(product1.name).toBe("Product A");
        expect(product1.price).toBe(10);

        const product2 = listResponse.body.products[1];

        expect(product2.name).toBe("Product B");
        expect(product2.price).toBe(40);
    });

    it("should be list all products in xml", async () => {
        const response1 = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Product A",
                price: 10
            });

        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/product")
            .send({
                type: "b",
                name: "Product B",
                price: 20
            });

        expect(response2.status).toBe(200);

        const listResponseXML = await request(app)
            .get("/product")
            .set("Accept", "application/xml")
            .send();

        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(listResponseXML.text).toContain(`<products>`);
        expect(listResponseXML.text).toContain(`<product>`);
        expect(listResponseXML.text).toContain(`<name>Product A</name>`);
        expect(listResponseXML.text).toContain(`<price>10</price>`);
        expect(listResponseXML.text).toContain(`</product>`);
        expect(listResponseXML.text).toContain(`<product>`);
        expect(listResponseXML.text).toContain(`<name>Product B</name>`);
        expect(listResponseXML.text).toContain(`<price>40</price>`);
        expect(listResponseXML.text).toContain(`</product>`);
        expect(listResponseXML.text).toContain(`</products>`);
    })
});