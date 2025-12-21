"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const jwt_1 = require("../config/jwt");
describe("RBAC Middleware", () => {
    it("returns 401 without token", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/protected");
        expect(res.status).toBe(401);
    });
    it("returns 403 for forbidden role", async () => {
        const token = (0, jwt_1.signToken)({
            userId: "123",
            role: "student"
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/protected")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(403);
    });
});
