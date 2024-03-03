declare global{
    namespace Express {
        export interface Request {
            user?: {id: string, role: string} 
        }
    }

    interface UserUpdate {
        email?: string;
        name?: string;
        socials?: string[];
      }
}

export {}