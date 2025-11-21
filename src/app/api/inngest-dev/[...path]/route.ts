import { NextRequest, NextResponse } from 'next/server';

const INNGEST_DEV_SERVER_URL = process.env.INNGEST_DEV_SERVER_URL || 'http://localhost:8288';

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        // Reconstruct the path from the catch-all route
        const pathSegments = params.path || [];
        const queryString = request.nextUrl.search;

        // Build the target URL
        const targetPath = pathSegments.join('/');
        const targetUrl = `${INNGEST_DEV_SERVER_URL}/${targetPath}${queryString}`;

        // Fetch from Inngest Dev Server
        const response = await fetch(targetUrl, {
            headers: {
                'Accept': request.headers.get('Accept') || '*/*',
                'User-Agent': 'Mozilla/5.0',
            },
        });

        if (!response.ok) {
            return new NextResponse(`Failed to fetch: ${response.statusText}`, {
                status: response.status,
            });
        }

        // Get the content type
        const contentType = response.headers.get('Content-Type') || 'text/html';
        const content = await response.text();

        // If it's HTML, we need to rewrite URLs to go through our proxy
        if (contentType.includes('text/html')) {
            const baseUrl = new URL(INNGEST_DEV_SERVER_URL).origin;
            const proxyBase = request.nextUrl.origin;
            const escapedBaseUrl = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Rewrite all URLs to use our proxy
            let rewrittenContent = content
                // Replace absolute URLs pointing to the Inngest server in href/src/action
                .replace(new RegExp(`href="${escapedBaseUrl}`, 'g'),
                    `href="${proxyBase}/api/inngest-dev`)
                .replace(new RegExp(`src="${escapedBaseUrl}`, 'g'),
                    `src="${proxyBase}/api/inngest-dev`)
                .replace(new RegExp(`action="${escapedBaseUrl}`, 'g'),
                    `action="${proxyBase}/api/inngest-dev`)
                // Replace relative URLs (starting with /)
                .replace(/href="\//g, `href="${proxyBase}/api/inngest-dev/`)
                .replace(/src="\//g, `src="${proxyBase}/api/inngest-dev/`)
                .replace(/action="\//g, `action="${proxyBase}/api/inngest-dev/`)
                // Replace in JavaScript strings (single and double quotes)
                .replace(new RegExp(`fetch\\(['"]${escapedBaseUrl}`, 'g'),
                    `fetch('${proxyBase}/api/inngest-dev`)
                .replace(new RegExp(`fetch\\(['"]\\/`, 'g'),
                    `fetch('${proxyBase}/api/inngest-dev/`)
                .replace(new RegExp(`['"]${escapedBaseUrl}`, 'g'),
                    `'${proxyBase}/api/inngest-dev`);

            return new NextResponse(rewrittenContent, {
                status: 200,
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'X-Frame-Options': 'SAMEORIGIN', // Allow iframe from same origin
                },
            });
        }

        // For non-HTML content (JSON, JS, CSS, etc.), return as-is
        return new NextResponse(content, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error: any) {
        console.error('Error proxying Inngest dev server:', error);
        return new NextResponse(
            JSON.stringify({ error: error.message || 'Failed to proxy request' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleRequest(request, params, 'POST');
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleRequest(request, params, 'PUT');
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleRequest(request, params, 'DELETE');
}

async function handleRequest(
    request: NextRequest,
    params: { path: string[] },
    method: string
) {
    try {
        const pathSegments = params.path || [];
        const queryString = request.nextUrl.search;
        const targetPath = pathSegments.join('/');
        const targetUrl = `${INNGEST_DEV_SERVER_URL}/${targetPath}${queryString}`;

        const body = method !== 'GET' && method !== 'DELETE'
            ? await request.text()
            : undefined;

        const response = await fetch(targetUrl, {
            method,
            headers: {
                'Content-Type': request.headers.get('Content-Type') || 'application/json',
                'Accept': request.headers.get('Accept') || '*/*',
            },
            body: body || undefined,
        });

        const contentType = response.headers.get('Content-Type') || 'application/json';
        const content = await response.text();

        return new NextResponse(content, {
            status: response.status,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error: any) {
        console.error(`Error proxying ${method} to Inngest dev server:`, error);
        return new NextResponse(
            JSON.stringify({ error: error.message || 'Failed to proxy request' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

