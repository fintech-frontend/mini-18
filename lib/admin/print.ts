/** Hujjatni (hisob-faktura, TTN) yangi oynada chop etish */
export function printDoc(title: string, body: string) {
  const w = window.open("", "_blank", "width=820,height=900");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Arial,sans-serif;padding:32px;color:#111}table{width:100%;border-collapse:collapse;margin:16px 0}
th,td{border:1px solid #bbb;padding:8px;text-align:left;font-size:13px}th{background:#f1f3f8}h2{margin:0 0 8px}</style></head>
<body>${body}<script>window.onload=function(){window.print()}<\/script></body></html>`);
  w.document.close();
}
