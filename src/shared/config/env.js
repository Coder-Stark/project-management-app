import 'dotenv/config';
import {z} from 'zod';

const schema = z.object({
    PORT: z.coerce.number().default(5000),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    CLIENT_URL: z
        .string()
        .min(1, "CLIENT_URL is required")
        .transform((value) => value.replace(/\/+$/, "")),
    JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
    JWT_EXPIRES_IN: z.string().default("7d"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:');
    parsed.error.issues.forEach((issue) => {
        console.error(`- ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
}

export const env = parsed.data;