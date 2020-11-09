import {TCreator, TTopic} from "./topic";

export interface TMessage {
    id: string;
    content: string;
    topic: TTopic;
    creator: TCreator;
    created: Date;
    updated: Date;
}
