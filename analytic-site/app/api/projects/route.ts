import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getSessionCompany } from '@/lib/auth';
import { isValidProjectName } from '@/lib/validation';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const db = await getDatabase();
    const projects = await db
      .collection('projects')
      .find({ companyId: company._id })
      .toArray();

    return createSuccessResponse(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return createErrorResponse('Failed to fetch projects', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const body = await request.json();
    const { name, environment } = body;

    if (!name || !isValidProjectName(name)) {
      return createErrorResponse('Invalid project name', 400);
    }

    if (!['production', 'staging', 'development'].includes(environment)) {
      return createErrorResponse('Invalid environment', 400);
    }

    const db = await getDatabase();

    const project = {
      companyId: company._id,
      name,
      environment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('projects').insertOne(project);

    console.log('[v0] Project created:', result.insertedId);

    return createSuccessResponse(
      { ...project, _id: result.insertedId },
      201,
      'Project created successfully'
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return createErrorResponse('Failed to create project', 500);
  }
}
