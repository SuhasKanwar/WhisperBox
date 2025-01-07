import { Message } from '@/src/models/Messages';

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages ?: boolean;
    messages ?: Array<Message>;
}