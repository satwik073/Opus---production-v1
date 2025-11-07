import { NextRequest, NextResponse } from 'next/server';

const INNGEST_DEV_SERVER_URL = process.env.INNGEST_DEV_SERVER_URL || 'http://localhost:8288';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const targetUrl = searchParams.get('url');
    
    if (!targetUrl) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }
    
    // Fetch from Inngest Dev Server (Next.js can access localhost)
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    
    if (!response.ok) {
      return new NextResponse(`Failed to fetch: ${response.statusText}`, {
        status: response.status,
      });
    }
    
    let html = await response.text();
    
    // Rewrite relative URLs to go through our proxy
    const targetUrlObj = new URL(targetUrl);
    const baseUrl = targetUrlObj.origin;
    const proxyBase = request.nextUrl.origin;
    
    // Replace relative URLs (starting with /) to use our proxy
    html = html.replace(/href="\//g, `href="${proxyBase}/api/inngest-proxy?url=${encodeURIComponent(baseUrl)}/`);
    html = html.replace(/src="\//g, `src="${proxyBase}/api/inngest-proxy?url=${encodeURIComponent(baseUrl)}/`);
    html = html.replace(/action="\//g, `action="${proxyBase}/api/inngest-proxy?url=${encodeURIComponent(baseUrl)}/`);
    
    // Replace absolute URLs pointing to the Inngest server
    html = html.replace(new RegExp(`href="${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), `href="${proxyBase}/api/inngest-proxy?url=${encodeURIComponent(baseUrl)}`);
    html = html.replace(new RegExp(`src="${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), `src="${proxyBase}/api/inngest-proxy?url=${encodeURIComponent(baseUrl)}`);
    
    // Return HTML without X-Frame-Options header (allows iframe embedding)
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
        // Don't set X-Frame-Options to allow iframe embedding
      },
    });
  } catch (error: any) {
    console.error('Error proxying:', error);
    return new NextResponse(`Error: ${error.message}`, {
      status: 500,
    });
  }
}
