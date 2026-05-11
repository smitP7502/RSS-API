import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Stock Mate API",
            version: "1.0.0",
            description: "Inventory & stock management REST API",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                // ── Generic wrappers ──────────────────────────────────────
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Success" },
                        data: {},
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Something went wrong" },
                        data: { nullable: true, example: null },
                    },
                },
                PaginationMeta: {
                    type: "object",
                    properties: {
                        total: { type: "integer", example: 100 },
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        totalPages: { type: "integer", example: 10 },
                    },
                },

                // ── Auth ──────────────────────────────────────────────────
                RegisterBody: {
                    type: "object",
                    required: ["email", "name", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "john@example.com" },
                        name: { type: "string", minLength: 3, example: "John Doe" },
                        password: { type: "string", minLength: 6, example: "secret123" },
                    },
                },
                LoginBody: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "john@example.com" },
                        password: { type: "string", minLength: 6, example: "secret123" },
                    },
                },
                AuthUser: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", example: "john@example.com" },
                        role: { type: "string", enum: ["admin", "user"], example: "user" },
                    },
                },

                // ── Product ───────────────────────────────────────────────
                Product: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Widget A" },
                        sku: { type: "string", example: "WGT-001" },
                        description: { type: "string", nullable: true, example: "A small widget" },
                        price: { type: "number", example: 9.99 },
                        stock: { type: "integer", example: 50 },
                        minStock: { type: "integer", example: 5 },
                        unit: { type: "string", example: "pcs" },
                        supplierId: { type: "integer", nullable: true, example: 2 },
                    },
                },
                CreateProductBody: {
                    type: "object",
                    required: ["name", "sku", "price", "unit"],
                    properties: {
                        name: { type: "string", minLength: 3, example: "Widget A" },
                        sku: { type: "string", example: "WGT-001" },
                        price: { type: "number", example: 9.99 },
                        description: { type: "string", example: "A small widget" },
                        minStock: { type: "integer", default: 5, example: 5 },
                        unit: { type: "string", example: "pcs" },
                        supplierId: { type: "integer", example: 2 },
                    },
                },
                UpdateProductBody: {
                    type: "object",
                    properties: {
                        name: { type: "string", minLength: 3, example: "Widget A" },
                        sku: { type: "string", example: "WGT-001" },
                        price: { type: "number", example: 9.99 },
                        description: { type: "string", example: "A small widget" },
                        minStock: { type: "integer", example: 5 },
                        unit: { type: "string", example: "pcs" },
                        supplierId: { type: "integer", example: 2 },
                    },
                },

                // ── Supplier ──────────────────────────────────────────────
                Supplier: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Acme Corp" },
                        email: { type: "string", nullable: true, example: "acme@example.com" },
                        phone: { type: "string", example: "9876543210" },
                        address: { type: "string", nullable: true, example: "123 Main St, Springfield" },
                    },
                },
                CreateSupplierBody: {
                    type: "object",
                    required: ["name", "phone"],
                    properties: {
                        name: { type: "string", minLength: 3, example: "Acme Corp" },
                        email: { type: "string", format: "email", example: "acme@example.com" },
                        phone: { type: "string", pattern: "^[0-9]{10}$", example: "9876543210" },
                        address: { type: "string", minLength: 30, example: "123 Main Street, Springfield, IL 62701" },
                    },
                },
                UpdateSupplierBody: {
                    type: "object",
                    properties: {
                        name: { type: "string", minLength: 3, example: "Acme Corp" },
                        email: { type: "string", format: "email", example: "acme@example.com" },
                        phone: { type: "string", pattern: "^[0-9]{10}$", example: "9876543210" },
                        address: { type: "string", minLength: 5, example: "456 Oak Ave, Springfield" },
                    },
                },

                // ── Stock ─────────────────────────────────────────────────
                StockMovement: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        type: { type: "string", enum: ["IN", "OUT"], example: "IN" },
                        quantity: { type: "integer", example: 20 },
                        note: { type: "string", nullable: true, example: "Restocked from supplier" },
                        productId: { type: "integer", example: 1 },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                StockBody: {
                    type: "object",
                    required: ["productId", "quantity"],
                    properties: {
                        productId: { type: "integer", minimum: 1, example: 1 },
                        quantity: { type: "integer", minimum: 1, example: 20 },
                        note: { type: "string", example: "Restocked from supplier" },
                    },
                },
            },
        },
        security: [],
    },
    apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
