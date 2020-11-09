export interface TCreator {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    date_joined: string;
}

export interface TTopic {
    id: string;
    name: string;
    creator: TCreator;
    created: string;
    updated: string;
}
