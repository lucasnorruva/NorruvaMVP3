
// --- File: src/app/api/v1/dpp/import/jobs/[jobId]/route.ts ---
// Description: API endpoint to retrieve the status of a batch import job.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_IMPORT_JOBS, type ImportJob } from '@/data'; // Import ImportJob type

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const auth = validateApiKey(request);
  if (auth) return auth;

  const job = MOCK_IMPORT_JOBS.get(params.jobId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  if (!job) {
    return NextResponse.json(
      { error: { code: 404, message: `Job with ID ${params.jobId} not found.` } },
      { status: 404 }
    );
  }

  // Simulate job progress if it's pending
  if (job.status === 'PendingProcessing') {
    const chanceOfChange = 0.3; // 30% chance the job status changes
    if (Math.random() < chanceOfChange) {
      const outcome = Math.random();
      if (outcome < 0.7) { // 70% chance of success among changed jobs
        job.status = 'Completed';
        const processedCount = Math.floor(Math.random() * 100) + 1;
        job.message = `Processing complete. ${processedCount} records successfully imported.`;
      } else { // 30% chance of failure among changed jobs
        job.status = 'Failed';
        const errorReasons = ["Data validation error", "Timeout during processing", "Invalid file format detected"];
        job.message = `Job failed. Reason: ${errorReasons[Math.floor(Math.random() * errorReasons.length)]}.`;
      }
      MOCK_IMPORT_JOBS.set(params.jobId, job); // Update the job in our mock store
    }
  }

  return NextResponse.json(job);
}
