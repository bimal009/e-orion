import Pusher from "pusher";

const appId = process.env.NEXT_PUBLIC_PUSHER_APP_ID!;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY!;
const secret = process.env.NEXT_PUBLIC_PUSHER_SECRET!;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

const pusher = new Pusher({
    appId: appId!,
    key: key!,
    secret: secret!,
    cluster: cluster!,
    useTLS: true,
});

export default pusher;


