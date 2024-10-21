import express from "express";
import next from "next";
import axios from "axios";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const basePort =  process.env.PORT || 3000;

const app = express();

app.get("/api/pokemon", async (req, res) => {
  const { page = 1, limit = 25 } = req.query;  
  const offset = (page - 1) * limit;

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const results = response.data.results;

    const detailedResults = await Promise.all(
      results.map(async (pokemon) => {
        const details = await axios.get(pokemon.url);
        return details.data;
      })
    );

    res.json({
      data: detailedResults,
      currentPage: parseInt(page),  
      totalPages: Math.ceil(response.data.count / limit),  
      totalItems: response.data.count, 
    });

  } catch (error) {
    res.status(500).json({ error: "Error fetching data from server" });
    console.log(error);
  }
});

nextApp.prepare().then(() => {
  console.log("Next.js started");

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // Inicia el servidor en el puerto 3000
  app.listen(basePort, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
