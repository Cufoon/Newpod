import { serve } from 'https://deno.land/std@0.182.0/http/server.ts';
import { serveDir, serveFile } from 'https://deno.land/std@0.182.0/http/file_server.ts';

const setHeaders = (res) => {
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self'"
  );
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Server', 'LitServer');
  res.headers.set('X-Cufoon-Request', `time=${Date.now()}`);
  return res;
};

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  if (pathname.startsWith('/api')) {
    const headers = req.headers;
    const authorization = headers.get('authorization');
    // const contentType = headers.get('content-type');
    const tcAction = headers.get('x-tc-action');
    const tcVersion = headers.get('x-tc-version');
    const tcTimestamp = headers.get('x-tc-timestamp');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', authorization);
    myHeaders.append('Content-Type', 'application/json; charset=utf-8');
    myHeaders.append('X-TC-Action', tcAction);
    myHeaders.append('X-TC-Timestamp', tcTimestamp);
    myHeaders.append('X-TC-Version', tcVersion);

    const requestOptions = {
      method: 'POST',
      body: req.body,
      headers: myHeaders,
      redirect: 'follow'
    };
    const res = await fetch('https://dnspod.tencentcloudapi.com/', requestOptions);

    const rHeaders = { headers: new Headers(res.headers) };

    return new Response(res.body, {
      headers: setHeaders(rHeaders).headers,
      status: res.status
    });
  }
  const res = await serveDir(req, {
    fsRoot: './html'
  });
  if (res.status === 404 && !new RegExp('\\.[a-zA-Z0-9]+$').test(pathname)) {
    const res = await serveFile(req, './html/index.html');
    return setHeaders(res);
  }
  return setHeaders(res);
});
