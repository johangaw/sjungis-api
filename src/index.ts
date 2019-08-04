import express, { json } from "express";
import { all, get, create, edit } from "./song-storage";
import { ErrorRequestHandler } from "express-serve-static-core";

const app = express();
const port = process.env.PORT || 8080;

app.use(json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  console.debug(`${req.method} ${req.url}`)
  if (['post', 'put', 'patch'].includes(req.method.toLowerCase())) {
    console.debug(req.body);
  }
  next();
})

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

app.put("/api/v1/songs/:songId", async ( req, res ) => {
  const song = await edit({...req.body, _id: req.params.songId});
  res.status(200).send(song);
});

app.post("/api/v1/songs", async ( req, res ) => {
  const song = await create(req.body);
  res.status(201).send(song);
});


app.use(handleError);

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
})