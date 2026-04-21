
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/projects.json');

export async function GET() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProject = await request.json();
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    const projects = JSON.parse(data);
    newProject.id = Date.now();
    projects.unshift(newProject);
    fs.writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2));
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    let projects = JSON.parse(data);
    projects = projects.filter((p: any) => p.id !== parseInt(id!));
    fs.writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProject = await request.json();
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    let projects = JSON.parse(data);
    const index = projects.findIndex((p: any) => p.id === updatedProject.id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updatedProject };
      fs.writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2));
      return NextResponse.json(projects[index]);
    }
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

