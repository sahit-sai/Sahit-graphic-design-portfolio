
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/messages.json');

export async function GET() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Failed to read messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newMessage = await request.json();
    newMessage.id = Date.now();
    newMessage.createdAt = new Date().toISOString();

    let messages = [];
    if (fs.existsSync(DATA_PATH)) {
      const data = fs.readFileSync(DATA_PATH, 'utf8');
      messages = JSON.parse(data);
    }

    messages.unshift(newMessage); // Add to the beginning
    fs.writeFileSync(DATA_PATH, JSON.stringify(messages, null, 2));

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Failed to save message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Delete specific message
      if (fs.existsSync(DATA_PATH)) {
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        let messages = JSON.parse(data);
        messages = messages.filter((m: any) => m.id !== parseInt(id));
        fs.writeFileSync(DATA_PATH, JSON.stringify(messages, null, 2));
        return NextResponse.json({ success: true });
      }
    } else {
      // Reset all messages
      fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
