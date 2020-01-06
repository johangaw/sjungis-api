process.env.MONGODB_URL = 'mongodb://localhost:27017/sjungis-test'

import { expect } from 'chai';
import 'mocha';
import { all, songsCollection, edit, create } from './song-storage';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { ISong } from './etc';

let col: Collection<ISong>, client: MongoClient;

before(async () => {
  [col, client] = await songsCollection();
})

after(async () => {
  client.close();
})

beforeEach(() => {
  return col.deleteMany({});
})

describe('all', () => {
  describe('when the db is empty', () => {
    it('return an empty array', async () => {
      expect(await all()).to.be.empty;
    });
  });
});

describe('edit', () => {
  it('does not change the urlName', async () => {
    const song = {name: 'name', melody: 'mel 1', urlName: 'name', lyrics: 'lyrics', obscene: true, _id: undefined as any}
    const result = await col.insertOne(song);
    await edit({...song, melody: 'mel 2', obscene: false});
    const updatedSong = await col.findOne({_id: result.insertedId});
    expect(updatedSong.name).to.equal('name');
    expect(updatedSong.melody).to.equal('mel 2');
    expect(updatedSong.lyrics).to.equal('lyrics');
    expect(updatedSong.urlName).to.equal('name');
    expect(updatedSong.obscene).to.equal(false);
  });
});

describe('create', () => {
  it('sets the urlName to the name', async () => {
    const song = await create({name: 'name', melody: 'mel 1', lyrics: 'lyrics', obscene: true});
    const created = await col.findOne({_id: new ObjectId(song._id)});
    expect(created.name).to.equal('name');
    expect(created.melody).to.equal('mel 1');
    expect(created.lyrics).to.equal('lyrics');
    expect(created.urlName).to.equal('name');
    expect(created.obscene).to.equal(true);
  });

  describe('when creating a second song the the same name', () => {
    it('invent a nameUrl for the second one', async () => {
      const song1 = await create({name: 'name', melody: 'mel 1', lyrics: 'lyrics', obscene: false});
      const created1 = await col.findOne({_id: new ObjectId(song1._id)});
      expect(created1.urlName).to.equal('name');
  
      const song2 = await create({name: 'name', melody: 'mel 1', lyrics: 'lyrics', obscene: false});
      const created2 = await col.findOne({_id: new ObjectId(song2._id)});
      expect(created2.urlName).to.not.equal('name');
      expect(created2.urlName.startsWith('name')).to.be.true;
    });
  });
});