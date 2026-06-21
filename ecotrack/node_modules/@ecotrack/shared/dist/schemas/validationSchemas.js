import { z } from 'zod';
const COMMON_PASSWORDS = [
    'password123',
    '1234567890',
    'qwertyuiop',
    'admin12345',
    'password12345',
    'welcome123'
];
export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be 2 to 60 characters').max(60, 'Name must be 2 to 60 characters'),
    email: z.string().email('Invalid email address').transform(val => val.trim().toLowerCase()),
    password: z.string()
        .min(10, 'Password must be at least 10 characters long')
        .refine(val => /[A-Za-z]/.test(val), { message: 'Password must contain at least one letter' })
        .refine(val => /[0-9]/.test(val), { message: 'Password must contain at least one number' })
        .refine(val => !COMMON_PASSWORDS.includes(val.toLowerCase()), { message: 'This password is too common and insecure' }),
    confirmPassword: z.string(),
    acceptedTerms: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions'
    }),
    recaptchaToken: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});
export const activitySchema = z.object({
    category: z.enum(['transport', 'energy', 'food', 'waste', 'water']),
    subtype: z.string().min(1, 'Subtype is required'),
    quantity: z.number().positive('Quantity must be greater than zero'),
    loggedAt: z.string().or(z.date()).transform(val => new Date(val)).refine(date => {
        // Cannot be in the future (allowing slight margin for clock drift)
        return date.getTime() <= Date.now() + 60000;
    }, { message: 'Date cannot be in the future' }),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').nullable().optional()
}).refine(data => {
    // Sanity ceilings per category
    if (data.category === 'transport') {
        return data.quantity <= 20000; // max 20,000 km
    }
    if (data.category === 'energy') {
        return data.quantity <= 10000; // max 10,000 kWh
    }
    if (data.category === 'food') {
        return data.quantity <= 100; // max 100 servings
    }
    if (data.category === 'waste') {
        return data.quantity <= 1000; // max 1000 kg
    }
    if (data.category === 'water') {
        return data.quantity <= 100000; // max 100,000 litres
    }
    return true;
}, {
    message: 'Quantity exceeds sanity ceiling limit for this category',
    path: ['quantity']
});
export const goalSchema = z.object({
    category: z.string().min(1, 'Category is required'),
    type: z.enum(['percent_reduction', 'absolute_target']),
    targetValue: z.number().positive('Target must be greater than zero'),
    targetDate: z.string().or(z.date()).transform(val => new Date(val)).refine(date => {
        return date.getTime() > Date.now();
    }, { message: 'Target date must be in the future' })
});
