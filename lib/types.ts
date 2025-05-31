

export interface User {
    id: string;
    name?: string;
    email: string;
    emailVerified?: Date;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    tournaments?: Tournament[];
    accounts?: Account[];
    sessions?: Session[];
  }
  
  export interface Account {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
    user?: User;
  }
  
  export interface Session {
    id: string;
    sessionToken: string;
    userId: string;
    expires: Date;
    user?: User;
  }
  
  export interface VerificationToken {
    id: string;
    identifier: string;
    token: string;
    expires: Date;
  }
  
  export interface Tournament {
    ownerId:string
    id?: string;
    name: string;
    logo: string;
    owner?: User;
    rounds?: Round[];
    groups?: Group[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Round {
    id: string;
    name: string;
    tournamentId: string;
    tournament?: Tournament;
    matches?: Match[];
  }
  
  export interface Match {
    id: string;
    matchNo: number;
    name: string;
    roundId: string;
    round?: Round;
    mapId: string;
    map?: Map;
    startTime: Date;
    endTime?: Date;
    teams?: Team[];
  }
  
  export interface Team {
    id: string;
    name: string;
    logo?: string;
    players?: Player[];
    groupId?: string;
    group?: Group;
    matches?: Match[];
  }
  
  export interface Player {
    id: string;
    name: string;
    ign: string;
    role?: string;
    teamId: string;
    team?: Team;
  }
  
  export interface Group {
    id: string;
    name: string;
    tournamentId: string;
    tournament?: Tournament;
    teams?: Team[];
  }
  
  export interface Map {
    id: string;
    name: string;
    matches?: Match[];
  }
  