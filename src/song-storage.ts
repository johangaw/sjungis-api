import { ISong } from "./etc";


export function all(): Promise<ISong[]> {
  return Promise.resolve(songs);
}

export function get(id: string): Promise<ISong> {
  return Promise.resolve(songs.find((song) => song.id === id));
}

export function create(song: ISong): Promise<ISong> {
  song.id = `${songs.length + 1}`;
  songs.push(song);
  return Promise.resolve(song);
}

function trimLines(text: string): string {
  return text
    .split('\n')
    .map(line => line.trim())
    .join('\n');
}

const songs: ISong[] = [
  {
    id: '1',
    name: 'Till Spritbolaget',
    melody: 'Du kära lille snickerbo',
    lyrics: `Till spritbolaget ränner jag
    Och bankar på dess port.
    Jag vill ha nåt’ som bränner bra
    Och gör mig sketfull fort.
    Expediten fråga och sa:
    Hur gammal kan min herre va?
    Har du nåt legg  ditt fula drägg
    Kom hit igen när du fått skägg.

    Nej, detta var ju inte bra,
    Jag ska bli full i kväll.
    Då kom jag på en bra idé,
    Dom har ju sprit på Shell.
    Många flaskor stod där på rad.
    Hurra, nu kan jag bli full och glad.
    Den röda drycken rann ju ner.
    Nu kan jag inte se nåt mer.`,
  },
  {
    id: '2',
    name: 'Helan går',
    melody: 'Helan går',
    lyrics: `Helan går, sjung hopp faderallanlej
    Helan går, sjung hopp faderallanlej
    Och den som inte helan tar
    han heller inte halvan får
    Helan går, sjung hopp faderallanlej`,
  },
  {
    id: '3',
    name: 'Alla vänner som vi känner',
    melody: 'Oh my darling',
    lyrics: `Alla vänner som vi känner att vår ungdoms ork finns kvar
    lyft pokalen här i salen till en skål för flydda dar
    
    Ack vår ungdom glada ungdom när vi dansa´ natten lång
    är den tiden nu förliden som var fylld av skratt och sång
    
    Nej tillsammans ut i gamman ska vi möta än en vår
    kom i svängen hör refrängen skål för flydda jubelår`,
  },
]

songs.forEach((song) => song.lyrics = trimLines(song.lyrics));