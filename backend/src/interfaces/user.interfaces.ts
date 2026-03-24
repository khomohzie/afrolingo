import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    selectedLanguage: 'yoruba' | 'igbo' | 'hausa' | null;
    xp: number;
    streak: number;
    lastPracticeDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}