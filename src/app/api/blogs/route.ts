
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/blogs.json');

export async function GET() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newBlog = await request.json();
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    const blogs = JSON.parse(data);
    newBlog.id = Date.now();
    blogs.unshift(newBlog);
    fs.writeFileSync(DATA_PATH, JSON.stringify(blogs, null, 2));
    return NextResponse.json(newBlog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    let blogs = JSON.parse(data);
    blogs = blogs.filter((b: any) => b.id !== parseInt(id!));
    fs.writeFileSync(DATA_PATH, JSON.stringify(blogs, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedBlog = await request.json();
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    let blogs = JSON.parse(data);
    const index = blogs.findIndex((b: any) => b.id === updatedBlog.id);
    if (index !== -1) {
      blogs[index] = { ...blogs[index], ...updatedBlog };
      fs.writeFileSync(DATA_PATH, JSON.stringify(blogs, null, 2));
      return NextResponse.json(blogs[index]);
    }
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

