export interface Fighter{
    name: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    uri: string;
    rank: Rank;
    strength: number;
    speed: number;
    endurance: number;
    wins: number;
    losses: number;
    wounds: number;
}

export enum Rank {
    Beginner,
    Novice,
    Apprentice,
    Adept,
    Master,
    GrandMaster,
    Legendary
}