export interface AuthenticatedUser {
    id: string;
    isArtist: boolean;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}
