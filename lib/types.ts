

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
  ownerId: string
  id?: string;
  name: string;
  logo: string | null;
  owner?: User;
  rounds?: Round[];
  groups?: Group[];
  createdAt?: Date;
  updatedAt?: Date;
  primaryColor: string;
  secondaryColor: string;
  textColor1: string;
  textColor2: string;
  teams?: Team[];
}

export interface Round {
  id: string;
  name: string;
  tournamentId: string;
  tournament?: Tournament;
  matches?: Match[];
  groups?: Group[];
  numberOfDays?: number;
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
  endTime?: Date | null;
  groupId?: string | null;
  group?: Group;
  teams?: Team[];
  day?: number | null;
}

export interface Team {
  id: string;
  name: string;
  teamTag?: string | null;
  logo?: string | null;
  players?: Player[];
  groupId?: string | null;
  group?: Group;
  matches?: Match[];
  tournamentId: string;
  tournament?: Tournament;
  roundId?: string | null;
  round?: Round;
  email?: string | null;
  phone?: string | null;
  isSelected?: boolean;
}

export interface Player {
  id: string;
  name: string;
  ign: string;
  role?: string | null;
  teamId: string;
  team?: Team;
  image?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface Group {
  id: string;
  name: string;
  tournamentId: string;
  tournament?: Tournament;
  teams?: Team[];
  matches?: Match[];
  roundId?: string | null;
  round?: Round;
}

export interface Map {
  id: string;
  name: string;
  matches?: Match[];
}


export type TournamentCreateInput = {
  name: string;
  logo?: string | null;
  primaryColor: string;
  secondaryColor: string;
  textColor1: string;
  textColor2: string;
};

export type RoundCreateInput = {
  id?: string;
  name: string;
  tournamentId: string;
  numberOfDays: number;
};

export type PointTableCreateInput = {
  id?: string;
  tournamentId: string;
  ranks: { rank: number; placementPoint: number }[];
  killPoint: number;
  pointTableName: string;
};


export type TeamCreateInput = {
  id?: string;
  name: string;
  tournamentId: string;
  teamTag?: string | null;
  logo?: string | null;
  groupId?: string | null;
  roundId?: string | null;
  players?: Player[];
  image?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type MatchCreateInput = {
  id?: string;
  matchNo: number;
  name: string;
  roundId: string;
  mapId: string;
  startTime: Date;
  endTime?: Date;
  groupId?: string | null;
  day?: number | null;
};

export type GroupCreateInput = {
  id?: string;
  name: string;
  tournamentId: string;
  roundId?: string | null;
  teams?: Team[];
  matches?: Match[];
};

export type GameCreateInput = {
  id?: string;
  matchNo: number;
  name: string;
  roundId: string;
  mapId: string;
  startTime: Date;
  endTime?: Date;
  groupId?: string | null;
  tournamentId: string;
  day?: number | null;
};