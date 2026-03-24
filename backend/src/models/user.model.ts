import bcrypt from 'bcrypt';
import { IUser } from 'interfaces/user.interfaces';
import mongoose, { Schema } from 'mongoose';

const userModel = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,
        },
        selectedLanguage: {
            type: String,
            enum: ['yoruba', 'igbo', 'hausa'],
            default: null,
        },
        xp: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
        lastPracticeDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

userModel.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (this.isModified('password')) {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userModel.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userModel);