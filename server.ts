import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.resolve(__dirname, 'public')));

/**
 * Builds HTML compliant with NSF PAPPG guidelines
 * - 8.5 x 11 inch Letter
 * - 1-inch minimum margins
 * - Arial/Helvetica 10-10.5pt font
 * - Required sections: Intellectual Merit, Broader Impacts
 */
export function buildNSFHtml(title: string, innerHtmlContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: letter;
      margin: 1in;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #111827;
      margin: 0;
      padding: 0;
    }
    .nsf-header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }
    .nsf-header h1 {
      font-size: 14pt;
      font-weight: bold;
      color: #0f172a;
      margin: 0 0 4px 0;
      letter-spacing: 0.5px;
    }
    .nsf-header .meta {
      font-size: 9pt;
      color: #475569;
      font-family: monospace;
    }
    h2 {
      font-size: 12pt;
      font-weight: bold;
      color: #0f172a;
      margin-top: 18px;
      margin-bottom: 8px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
    }
    h3 {
      font-size: 10.5pt;
      font-weight: bold;
      color: #1e293b;
      margin-top: 12px;
      margin-bottom: 6px;
    }
    p {
      margin-top: 0;
      margin-bottom: 8px;
      text-align: justify;
      text-justify: inter-word;
    }
    ul, ol {
      margin-top: 4px;
      margin-bottom: 10px;
      padding-left: 24px;
    }
    li {
      margin-bottom: 4px;
    }
    .nsf-box {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 10px 14px;
      margin: 12px 0;
      background-color: #f8fafc;
    }
    .nsf-box.merit {
      border-left: 4px solid #059669;
    }
    .nsf-box.impacts {
      border-left: 4px solid #0284c7;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 9pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: bold;
      color: #0f172a;
    }
    .footer-note {
      font-size: 8pt;
      color: #64748b;
      margin-top: 24px;
      text-align: center;
      border-top: 1px dashed #cbd5e1;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="nsf-header">
    <h1>${title}</h1>
    <div class="meta">NATIONAL SCIENCE FOUNDATION • PAPPG COMPLIANT PROJECT DOSSIER</div>
  </div>
  ${innerHtmlContent}
</body>
</html>`;
}

/**
 * Strips HTML tags and normalizes entities for plain text parsing
 */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Generates an NSF-compliant PDF using PDFKit
 * - Standard Letter (8.5 x 11 inches)
 * - 1-inch (72pt) margins on all 4 sides
 * - 10-10.5pt standard font
 * - Two-pass pagination footer: "Page X of Y"
 */
export async function generatePdfWithPdfKit(title: string, htmlContent: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER', // 8.5 x 11 inches (612 x 792 pt)
        margins: { top: 72, bottom: 72, left: 72, right: 72 }, // Exactly 1.0 inch
        bufferPages: true,
        info: {
          Title: title,
          Author: 'ONMOTIO Biohybrid Research Initiative',
          Subject: 'NSF Grant Proposal Project Description',
          Keywords: 'NSF, Phytomining, Biohybrid, STTR, Ecology'
        }
      });

      const chunks: Buffer[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', err => reject(err));

      // Header Banner
      doc.rect(72, 72, 468, 2).fill('#0f172a');
      doc.moveDown(0.3);

      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#0f172a')
        .text(title.toUpperCase(), { align: 'center', width: 468 });

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor('#475569')
        .text('NATIONAL SCIENCE FOUNDATION • PAPPG COMPLIANT PROPOSAL SPECIFICATION', { align: 'center', width: 468 });

      doc.moveDown(0.5);
      doc.rect(72, doc.y, 468, 1).fill('#cbd5e1');
      doc.moveDown(1.0);

      // Parse structured sections from HTML
      const rawText = stripHtml(htmlContent);
      const paragraphs = rawText.split(/\n\s*\n/);

      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;

        // Check if paragraph is a section heading (e.g. "1. Vision and Goals", "2. Intellectual Merit")
        if (/^(\d+\.|\bIntellectual Merit\b|\bBroader Impacts\b|[A-Z\s]{4,}:)/i.test(trimmed) && trimmed.length < 80) {
          doc.moveDown(0.8);

          // Highlight Intellectual Merit & Broader Impacts as required by NSF
          if (/intellectual merit/i.test(trimmed)) {
            doc.rect(72, doc.y, 468, 22).fill('#ecfdf5');
            doc
              .font('Helvetica-Bold')
              .fontSize(11)
              .fillColor('#065f46')
              .text(trimmed, 78, doc.y + 5, { width: 456 });
            doc.moveDown(0.5);
          } else if (/broader impacts/i.test(trimmed)) {
            doc.rect(72, doc.y, 468, 22).fill('#eff6ff');
            doc
              .font('Helvetica-Bold')
              .fontSize(11)
              .fillColor('#1e40af')
              .text(trimmed, 78, doc.y + 5, { width: 456 });
            doc.moveDown(0.5);
          } else {
            doc
              .font('Helvetica-Bold')
              .fontSize(11.5)
              .fillColor('#0f172a')
              .text(trimmed, { width: 468 });
            doc.moveDown(0.2);
            doc.rect(72, doc.y, 468, 0.5).fill('#e2e8f0');
            doc.moveDown(0.4);
          }
        } else if (/^[-•*]\s/.test(trimmed)) {
          // Bullet point items
          const lines = trimmed.split('\n');
          for (const line of lines) {
            const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
            doc
              .font('Helvetica')
              .fontSize(10)
              .fillColor('#1e293b')
              .text(`•  ${cleanLine}`, {
                indent: 14,
                lineGap: 2.5,
                width: 454,
                align: 'justify'
              });
          }
          doc.moveDown(0.4);
        } else {
          // Standard body paragraph
          doc
            .font('Helvetica')
            .fontSize(10)
            .fillColor('#1e293b')
            .text(trimmed, {
              lineGap: 3,
              width: 468,
              align: 'justify'
            });
          doc.moveDown(0.6);
        }
      }

      // Final pass: Add two-pass NSF Pagination Footer on every page
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        // Footer rule
        doc.rect(72, 792 - 58, 468, 0.5).fill('#cbd5e1');

        // Running page footer
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#64748b')
          .text(
            `Page ${i + 1} of ${range.count}`,
            72,
            792 - 50,
            { align: 'center', width: 468 }
          );

        doc
          .font('Helvetica')
          .fontSize(7.5)
          .fillColor('#94a3b8')
          .text(
            'NSF PAPPG Formatted • ONMOTIO Biohybrid Environmental Sensing Research',
            72,
            792 - 40,
            { align: 'center', width: 468 }
          );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Route to generate and return NSF-compliant PDF
 * Attempts Playwright Chromium first; falls back seamlessly to PDFKit
 */
app.post('/generate-nsf-pdf', async (req: Request, res: Response) => {
  const { title = "PROJECT DESCRIPTION", htmlContent } = req.body;

  if (!htmlContent) {
    res.status(400).json({ error: "htmlContent is required in request body." });
    return;
  }

  // Attempt 1: Try Playwright Headless Chromium (if installed/available)
  let browser: any = null;
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    const fullHtml = buildNSFHtml(title, htmlContent);
    await page.setContent(fullHtml, { waitUntil: 'domcontentloaded' });

    // Render PDF with NSF standard requirements
    const pdfBuffer = await page.pdf({
      format: 'Letter',              // Standard 8.5 x 11 inch paper
      printBackground: true,
      margin: {
        top: '1in',                  // NSF minimum 1-inch margins
        bottom: '1in',
        left: '1in',
        right: '1in'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>', // Empty header
      footerTemplate: `
        <div style="font-size: 9pt; font-family: Arial, sans-serif; color: #64748b; width: 100%; text-align: center; margin-bottom: 0.3in;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=NSF_Project_Description.pdf');
    res.setHeader('X-PDF-Engine', 'playwright-chromium');
    res.send(pdfBuffer);
    return;
  } catch (error) {
    if (browser) {
      try { await browser.close(); } catch (_) {}
    }
    console.warn("Playwright render unavailable or threw error, falling back to PDFKit vector engine:", (error as Error).message);
  }

  // Attempt 2: PDFKit Vector Engine (100% reliable, zero external binaries)
  try {
    const pdfBuffer = await generatePdfWithPdfKit(title, htmlContent);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=NSF_Project_Description.pdf');
    res.setHeader('X-PDF-Engine', 'pdfkit-nsf-vector');
    res.send(pdfBuffer);
  } catch (pdfKitError) {
    console.error("PDFKit Generation Error:", pdfKitError);
    res.status(500).json({ error: "Failed to generate NSF PDF file.", details: (pdfKitError as Error).message });
  }
});

// Explicit static routes for social meta crawlers (LinkedIn, Facebook, Twitter)
app.get('/og-image.jpg', (_req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/og-image.jpg'));
});
app.get('/logo.jpg', (_req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/logo.jpg'));
});
app.get('/favicon.jpg', (_req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/favicon.jpg'));
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ONMOTIO NSF PDF Engine & Research Workbench',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// In development, mount Vite middleware for full HMR SPA
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`NSF PDF Engine & ONMOTIO Workbench running on http://localhost:${PORT}`);
  });
}

startServer();
