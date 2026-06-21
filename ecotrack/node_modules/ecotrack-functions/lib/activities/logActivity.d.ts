export declare function updateDailySummary(db: FirebaseFirestore.Firestore, uid: string, dateStr: string): Promise<void>;
export declare const logActivity: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    activityId: string;
    co2eKg: number;
}>>;
