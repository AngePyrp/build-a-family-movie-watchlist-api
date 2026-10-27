import express from "express";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";

const PORT = 3000;
const app = express();

app.use(helmet());
app.use(express.json());
/*
app.use((req, res, next) => {
  const sendJson = res.json.bind(res);

  res.json = (body) => {
    console.log(
      `[response] ${req.method} ${req.originalUrl} ${res.statusCode} ${JSON.stringify(body)}`
    );
    return sendJson(body);
  };

  next();
});
*/ 
app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});