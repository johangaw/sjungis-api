import { ISong, ISongParams } from './etc';
import { MongoClient, Collection, ObjectId } from 'mongodb';

const MONGO_URL = process.env['MONGODB_URL'] || 'mongodb://localhost:27017'

function getURL(name: string): string {
  return encodeURIComponent(name);
}

async function createURL(name: string, id?: string): Promise<string> {
  const col = await songsCollection();
  let urlName = getURL(name);

  while(true) {
    const results = await col.find({urlName: urlName}).toArray();
    if(results.length === 0 || results.length === 1 && results[0]._id === id) {
      return urlName;
    } else {
      urlName = getURL(`${name} ${new Date().getMilliseconds()}`);
    }
  }
}

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

export async function get(urlName: string): Promise<ISong> {
  const col = await songsCollection();
  return col.findOne({urlName: getURL(urlName)});
}

export async function create(songParams: ISongParams): Promise<ISong> {
  const col = await songsCollection();
  const song: ISong = {...songParams, urlName: await createURL(songParams.name), _id: undefined};
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
    {$set: {name, lyrics, melody, urlName: await createURL(song.name, song._id)}},
    {returnOriginal: false}
  );
  if (result.value) {
    return result.value;
  } else {
    throw 'Could not update song'
  }
}