
export interface ISong {
  _id: string;
  name: string;
  lyrics: string;
  melody: string;
  urlName: string;
}

export type ISongParams = Pick<ISong, 'name'|'lyrics'|'melody'>