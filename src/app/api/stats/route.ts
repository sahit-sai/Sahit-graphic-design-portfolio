
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STATS_PATH = path.join(process.cwd(), 'src/data/stats.json');

export async function GET() {
  try {
    if (!fs.existsSync(STATS_PATH)) {
      return NextResponse.json({ views: 0, clicks: 0, time: "0s" });
    }
    const data = fs.readFileSync(STATS_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { type } = await request.json();
    if (fs.existsSync(STATS_PATH)) {
      const data = JSON.parse(fs.readFileSync(STATS_PATH, 'utf8'));
      if (type === 'reset') {
        const resetStats = { views: 0, clicks: 0, time: "0s" };
        fs.writeFileSync(STATS_PATH, JSON.stringify(resetStats, null, 2));
        return NextResponse.json(resetStats);
      }
      // Increment logic can be added here if needed
    }
    return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (fs.existsSync(STATS_PATH)) {
      const stats = JSON.parse(fs.readFileSync(STATS_PATH, 'utf8'));
      if (type === 'views') stats.views = 0;
      if (type === 'clicks') stats.clicks = 0;
      if (type === 'time') stats.time = "0s";
      
      fs.writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2));
      return NextResponse.json(stats);
    }
    return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 });
  }
}
