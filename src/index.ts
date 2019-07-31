import express, { json } from "express";
import { all, get, create } from "./song-storage";
import { ErrorRequestHandler } from "express-serve-static-core";

const app = express();
const port = 8080; // default port to listen

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  console.log(req.url)
  next();
})

app.use(json())

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json(err);
}

app.get("/api/v1/songs", async ( req, res ) => {
  const songs = await all();
  res.json(songs);
});

app.get("/api/v1/songs/:songId", async ( req, res ) => {
  const song = await get(req.params.songId);
  res.json(song);
});

app.post("/api/v1/songs", async ( req, res ) => {
  console.log(req.body);
  const song = await create(req.body);
  res.status(201).send(song);
});


app.use(handleError);

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
})