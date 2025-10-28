import app from "./app.js";
import connectDB from "./config/db.js";
import { envVariables } from "./config/envVariables.js";

connectDB();

const PORT = envVariables.PORT || 5001;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
