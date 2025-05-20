import * as ws from 'ws';
import queryString from 'query-string';
import { parseISO } from 'date-fns';
import { v4 } from 'uuid';

const rng = () => {
  return Math.random();
};

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng() * (max - min + 1)) + min;
}

const randomFromArray = <T>(array: T[]) => {
  const index = getRandomInt(0, array.length - 1);
  return array[index];
}

const notificationTemplates = [
  'poked you',
  'says hi!',
  `is glad we're friends`,
  'sent you a gift',
]

export async function generateRandomNotifications(since: string | undefined, numNotifications: number) {
  const now = new Date();

  let pastDate: Date;
  if (since) {
    pastDate = parseISO(since);
  } else {
    pastDate = new Date(now.valueOf());
    pastDate.setMinutes(pastDate.getMinutes() - 15);
  }

  // Create random notificatoin date between pastdate and now.
  const maxRange = now.valueOf() - pastDate.valueOf();
  const notifyDates = [...Array(numNotifications)].map(() => {
    const date = new Date(now.valueOf());
    const minValue = getRandomInt(0, maxRange);
    date.setTime(date.valueOf() - minValue);
    return date;
  });

  const notifications = [...Array(numNotifications)].map((_: number, index: number) => {
    const template = randomFromArray(notificationTemplates);
    const createDate = notifyDates[index];

    return {
      id: v4(),
      date: createDate.toISOString(),
      message: template,
      user: 'system', // or provide a valid userId here
      read: false,
      isNew: true
    }
  })

  return notifications
}

// Event types
const wssTypesDef = {
  FETCH_SINCE: 'fetch_since',
  NOTIFICATIONS: 'notifications'
}

const options = {
  noServer: true
};

type RegisterUser = { userId: string; client: ws.WebSocket };
const wss = new ws.Server(options);
let wsClients: RegisterUser[] = [];

export function userFromUrl(url: string) {
  let parseUrl = url;
  console.log('userFromUrl: ', url);
  if (url.startsWith('/')) {
    parseUrl = url.slice(1);
  }
  const parsed = queryString.parse(parseUrl);
  if (parsed.user) {
    return parsed.user as string;
  } else {
    return null;
  }
}

export function registerUser({ userId, client }: RegisterUser) {
  wsClients.push({ userId, client });
}
export function unRegisterUser({ userId }: RegisterUser) {
  wsClients = wsClients.filter((value) => {
    userId !== value.userId
  });
}

const sendRandomNotifications = async (since: string) => {
  const numNotifications = getRandomInt(1, 5)
  const notifications = await generateRandomNotifications(since, numNotifications);

  wss.clients.forEach(async function each(client) {
    if (client.readyState === ws.WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: wssTypesDef.NOTIFICATIONS,
        payload: notifications
      }));
    } else {
      console.log('sendRandomNotifications: not OPEN please review');
    }
  });
};

export async function handleMessage(message: ws.RawData) {
  const dataFromClient: { type: string; payload: string } = JSON.parse(message.toString());
  if (dataFromClient.type === wssTypesDef.FETCH_SINCE) {
    await sendRandomNotifications(dataFromClient.payload);
  }
}


export function handleDisconnect(user: string, socket: ws.WebSocket) {
  unRegisterUser({ userId: user, client: socket });
}

export { wss, wssTypesDef, wsClients };