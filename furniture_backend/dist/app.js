"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const rateLimiter_1 = require("./middlewares/rateLimiter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const path_1 = __importDefault(require("path"));
const v1_1 = __importDefault(require("./routes/v1"));
const node_cron_1 = __importDefault(require("node-cron"));
const settingService_1 = require("./services/settingService");
exports.app = (0, express_1.default)();
var whitelist = ["http://example1.com", "http://localhost:5173"];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};
exports.app
    .use((0, morgan_1.default)("dev"))
    .use(express_1.default.urlencoded({ extended: true }))
    .use(express_1.default.json())
    .use((0, cors_1.default)())
    .use((0, cookie_parser_1.default)())
    .use((0, helmet_1.default)())
    .use((0, compression_1.default)())
    .use(rateLimiter_1.limiter);
i18next_1.default
    .use(i18next_fs_backend_1.default)
    .use(i18next_http_middleware_1.default.LanguageDetector)
    .init({
    backend: {
        loadPath: path_1.default.join(process.cwd(), "src/locals", "{{lng}}", "{{ns}}.json"),
    },
    detection: {
        order: ["querystring", "cookie"],
        caches: ["cookies"],
    },
    fallbackLng: "en",
    preload: ["en", "mm"],
});
exports.app.use(i18next_http_middleware_1.default.handle(i18next_1.default));
exports.app.use(v1_1.default);
exports.app.use((error, req, res, next) => {
    const status = error.status || 500;
    const errorCode = error.code || "Error Code";
    const message = error.message || "Server Error";
    res.status(status).json({ message, error: errorCode });
});
node_cron_1.default.schedule("* * * * *", async () => {
    console.log("running a task every minute");
    const isMaintenance = await (0, settingService_1.getSettingStatus)("maintenance");
    if (isMaintenance?.value === "true") {
        await (0, settingService_1.createOrUpdateSettingStatus)("maintenance", "false");
        console.log("Maintenance mode is off");
    }
});
//# sourceMappingURL=app.js.map