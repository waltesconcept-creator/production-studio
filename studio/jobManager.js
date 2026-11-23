const fs = require('fs');
const path = require('path');

const jobs = new Map();

class JobManager {
  static createJob(type, payload = {}) {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const job = {
      id: jobId,
      type,
      status: 'queued', // queued, processing, completed, failed
      progress: 0,
      stage: 'Initializing generation request...',
      payload,
      result: null,
      error: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    jobs.set(jobId, job);
    return job;
  }

  static getJob(jobId) {
    return jobs.get(jobId) || null;
  }

  static updateJob(jobId, updates = {}) {
    const job = jobs.get(jobId);
    if (!job) return null;

    Object.assign(job, updates, { updatedAt: new Date().toISOString() });
    return job;
  }

  static listJobs() {
    return Array.from(jobs.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

module.exports = JobManager;
