"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require("dotenv/config");
require("./jobs/workers/imageWorker");
const PORT = process.env.PORT || 4000;
app_1.app.listen(PORT, () => console.log(` Server running: http://localhost:${PORT}`));
//# sourceMappingURL=index.js.map