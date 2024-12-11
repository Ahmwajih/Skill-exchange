import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Conversation
interface IConversation extends Document {
    providerId: mongoose.Types.ObjectId; // Reference to the Provider
    seekerId: mongoose.Types.ObjectId; // Reference to the Seeker
    messages: {
        senderId: mongoose.Types.ObjectId; // The user who sent the message
        content: string; // The message content
        timestamp: Date; // When the message was sent
    }[];
}

// Create the Conversation Schema
const conversationSchema: Schema<IConversation> = new mongoose.Schema(
    {
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        seekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        messages: [
            {
                senderId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now, // Automatically set to current date/time
                },
            },
        ],
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        versionKey: false, // Disable versioning (_v field)
    }
);

// Export the Conversation model
const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
