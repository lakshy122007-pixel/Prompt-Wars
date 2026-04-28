// scripts/setup-bigquery.ts
// Run: npx ts-node scripts/setup-bigquery.ts
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({ projectId: process.env.GCLOUD_PROJECT });
const DATASET_ID = 'election_education';

const schemas = {
  quiz_completion: [
    { name: 'userId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'quizId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'score', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'percentage', type: 'FLOAT', mode: 'REQUIRED' },
    { name: 'timeTaken', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'category', type: 'STRING', mode: 'REQUIRED' },
    { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
  ],
  chat_message: [
    { name: 'userId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'messageLength', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'responseLength', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'language', type: 'STRING', mode: 'REQUIRED' },
    { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
  ],
  user_signup: [
    { name: 'userId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'preferredLanguage', type: 'STRING', mode: 'REQUIRED' },
    { name: 'isAnonymous', type: 'BOOLEAN', mode: 'REQUIRED' },
    { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
  ],
  page_view: [
    { name: 'userId', type: 'STRING', mode: 'NULLABLE' },
    { name: 'page', type: 'STRING', mode: 'REQUIRED' },
    { name: 'language', type: 'STRING', mode: 'REQUIRED' },
    { name: 'sessionId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
  ],
};

async function setupBigQuery(): Promise<void> {
  // Create dataset
  const [datasetExists] = await bigquery.dataset(DATASET_ID).exists();
  if (!datasetExists) {
    await bigquery.createDataset(DATASET_ID, { location: 'asia-south1' });
    console.log(`✅ Dataset '${DATASET_ID}' created`);
  }

  // Create tables
  for (const [tableName, schema] of Object.entries(schemas)) {
    const table = bigquery.dataset(DATASET_ID).table(tableName);
    const [exists] = await table.exists();
    if (!exists) {
      await table.create({ schema, timePartitioning: { type: 'DAY', field: 'timestamp' } });
      console.log(`✅ Table '${tableName}' created with daily partitioning`);
    } else {
      console.log(`⏭️  Table '${tableName}' already exists`);
    }
  }
  console.log('\n🎉 BigQuery setup complete!');
}

setupBigQuery().catch(console.error);
