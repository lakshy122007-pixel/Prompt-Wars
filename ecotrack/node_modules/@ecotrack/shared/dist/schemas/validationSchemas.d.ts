import { z } from 'zod';
export declare const signUpSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>;
    confirmPassword: z.ZodString;
    acceptedTerms: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    recaptchaToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
    recaptchaToken?: string | undefined;
}, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
    recaptchaToken?: string | undefined;
}>, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
    recaptchaToken?: string | undefined;
}, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
    recaptchaToken?: string | undefined;
}>;
export declare const activitySchema: z.ZodEffects<z.ZodObject<{
    category: z.ZodEnum<["transport", "energy", "food", "waste", "water"]>;
    subtype: z.ZodString;
    quantity: z.ZodNumber;
    loggedAt: z.ZodEffects<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>, Date, string | Date>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    category: "transport" | "energy" | "food" | "waste" | "water";
    subtype: string;
    quantity: number;
    loggedAt: Date;
    notes?: string | null | undefined;
}, {
    category: "transport" | "energy" | "food" | "waste" | "water";
    subtype: string;
    quantity: number;
    loggedAt: string | Date;
    notes?: string | null | undefined;
}>, {
    category: "transport" | "energy" | "food" | "waste" | "water";
    subtype: string;
    quantity: number;
    loggedAt: Date;
    notes?: string | null | undefined;
}, {
    category: "transport" | "energy" | "food" | "waste" | "water";
    subtype: string;
    quantity: number;
    loggedAt: string | Date;
    notes?: string | null | undefined;
}>;
export declare const goalSchema: z.ZodObject<{
    category: z.ZodString;
    type: z.ZodEnum<["percent_reduction", "absolute_target"]>;
    targetValue: z.ZodNumber;
    targetDate: z.ZodEffects<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>, Date, string | Date>;
}, "strip", z.ZodTypeAny, {
    type: "percent_reduction" | "absolute_target";
    category: string;
    targetValue: number;
    targetDate: Date;
}, {
    type: "percent_reduction" | "absolute_target";
    category: string;
    targetValue: number;
    targetDate: string | Date;
}>;
