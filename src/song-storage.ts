import { ISong } from './etc';
import { MongoClient, Collection, ObjectId } from 'mongodb';

const MONGO_URL = process.env['MONGODB_URL'] || 'mongodb://localhost:27017'

async function songsCollection(): Promise<Collection<ISong>> {
  const client = await MongoClient.connect(MONGO_URL);
  const db = client.db('sjungis');
  const collection = db.collection('songs');
  return collection;
}

export async function all(): Promise<ISong[]> {
  const col = await songsCollection();
  return col.find().toArray();
}

export async function get(id: string): Promise<ISong> {
  const col = await songsCollection();
  return col.findOne({_id: new ObjectId(id)});
}

export async function create(song: ISong): Promise<ISong> {
  const col = await songsCollection();
  const result = await col.insertOne(song)
  if (result.insertedCount === 1) {
    return {...song, _id: result.insertedId.toHexString()}
  } else {
    throw 'Could not create song'
  }
}

export async function edit(song: ISong): Promise<ISong> {
  const col = await songsCollection();
  const {name, lyrics, melody} = song;
  const result = await col.findOneAndUpdate(
    {_id: new ObjectId(song._id)},
    {$set: {name, lyrics, melody}},
    {returnOriginal: false}
  );
  if (result.value) {
    return result.value;
  } else {
    throw 'Could not update song'
  }
}