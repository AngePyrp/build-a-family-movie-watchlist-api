import express from "express";
import authRoutes from "./routes/auth.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body." });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => console.log(`Watchlist API listening on port ${port}`));
