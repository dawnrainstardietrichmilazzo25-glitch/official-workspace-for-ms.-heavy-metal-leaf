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

// AI Research Co-Scientist Chatbot endpoint powered by Gemini 3.8 Flash
const ONMOTIO_SYSTEM_INSTRUCTION = `You are the ONMOTIO AI Co-Scientist and Research Assistant for the "Ms. Heavy Metal Leaf" project.
You collaborate directly with founder and concept visionary Dawn, hardware engineer Chrislance, designer Clément S (ONMOTIO London), R&D project manager Ahmed Ali, and electrical engineer Precious M.

CORE PROJECT IDENTITY & VISION:
- "Ms. Heavy Metal Leaf": An autonomous bio-hybrid organism and scientific paradigm: growing functional electronic and sensing architectures from living hyperaccumulator plants (Brassica juncea, Odontarrhena bertolonii) instead of extracting mined metals from the earth.
- Founder Dawn's Vision & Form Factor: Her humanoid avatar was her first intuitive aesthetic vision—an archetypal bridge between plant biology, human stewardship, cybernetic instrumentation, and myth. However, for physical engineering and field deployment, her form factor is completely alterable and optimized: modular floating wetland bio-rafts, vertical urban runoff cassettes, and fractal root geometries. Form follows ecological function.
- Four Pillars: 1) Clean toxic land & water through phytoremediation; 2) Prove metal conductors can be grown in plants using CAD-guided molds; 3) End open-pit mining through circular phytomining; 4) Replace planned-obsolescence machine robotics with living, responsive biobots.
- Phase 0 Findings: Validated Pearson correlation r = +0.89 between soil volumetric water content (VWC) and petiole angle deflection, with +17° deflection recovery in 90 min post-watering. Rhizosphere acidification below pH 6.3 increased tissue nickel translocation to 382 ppm (r = -0.84).

CRITICAL ELECTRICAL SAFETY & VOLTAGE PROTECTION PROTOCOLS (Dawn's priority):
1. Passive Listening vs Voltage Injection: The Analog Front-End (AFE) designed with the Texas Instruments INA128 instrumentation amplifier NEVER injects voltage or current into the plant. It has an ultra-high input impedance (> 10^12 ohms, 1 Teraohm) and sub-nanoamp bias currents (< 2 nA). It passively listens to endogenous ion flux without loading or damaging cell membranes.
2. Electrical Overstress (EOS) Protection: 
   - TVS (Transient Voltage Suppressor) and low-leakage Schottky diode clamps bridge input channels to ground, instantly shunting any static discharge or spike above 0.3V harmlessly away from the plant.
   - High-value current-limiting resistors (1MΩ to 10MΩ) in series with the Ag/AgCl petiole electrodes prevent any lethal current density (> 10 µA) from ever reaching living tissues.
   - Galvanic optoisolation and isolated DC-DC converters separate the plant from all mains power or high-voltage solar rails.
3. Electrical Field Shielding & Interference Suppression:
   - Faraday Cage Mesh: Grounded copper or aluminum mesh surrounds the growth chamber or sensor chassis to block ambient 50/60Hz electromagnetic hum from power lines and grow lights.
   - Active Guarding (Driven Guard Shield): Coaxial electrode leads use a buffer amplifier to drive the outer shield at the exact same potential as the signal wire, eliminating stray capacitive fields and parasitic leakage.
   - Dielectric potting: Biocompatible silicone encapsulates all copper traces to protect from water and root contact.

Tone and style:
Be warm, encouraging, scientifically authoritative, grounded in real bio-electrophysiology and electrical engineering. Address Dawn respectfully as the visionary founder. Provide clear, scannable explanations with practical bullet points.`;

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userQuestion } = req.body;
    
    // Determine the user prompt
    const prompt = userQuestion || (messages && messages.length > 0 ? messages[messages.length - 1].text : '');
    if (!prompt) {
      return res.status(400).json({ error: 'Message content or userQuestion is required' });
    }

    // Attempt Gemini API call via @google/genai SDK
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({});
        
        // Convert chat history format if provided
        const contents = messages && messages.length > 1
          ? messages.map((m: { role: string; text: string }) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.text }]
            }))
          : [{ role: 'user', parts: [{ text: prompt }] }];

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: ONMOTIO_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          }
        });

        const replyText = aiResponse.text || 'I analyzed your query regarding Ms. Heavy Metal Leaf bio-electrophysiology and safety.';
        return res.json({ reply: replyText, source: 'gemini-3.8-flash' });
      } catch (geminiErr) {
        console.error('Gemini API call failed, using scientific rule-based responder:', geminiErr);
      }
    }

    // Domain-expert fallback responder if API key is unconfigured or rate limited
    const lower = prompt.toLowerCase();
    let reply = '';

    if (lower.includes('kill') || lower.includes('voltage') || lower.includes('field') || lower.includes('shock') || lower.includes('protect')) {
      reply = `Hello Dawn! Rest assured, **we will NOT kill the plants with voltage**, and here is the exact electrical engineering strategy Chrislance and the team have put in place:

### 1. Why the Plant is Safe: Passive "Listening" Only
Our instrumentation amplifier (Texas Instruments INA128) operates in a **purely passive high-impedance mode**:
- **Input Impedance $> 10^{12}\ \Omega$ (1 Teraohm):** The circuit does not push or inject electrical voltage into the plant. It functions like a stethoscope—passively listening to the microscopic millivolt ionic changes ($-50\\text{ mV}$ to $+20\\text{ mV}$) naturally produced by the plant's cells.
- **Sub-nanoamp input bias current ($< 2\\text{ nA}$):** The electrical draw is thousands of times smaller than what could cause electroporation or tissue damage.

### 2. Can We Surround the Electrical Fields? (Faraday Shielding & Enclosures)
Yes! We have three physical layers to isolate and surround electrical fields:
1. **Grounded Copper/Aluminum Mesh (Faraday Cage):** A fine woven metallic mesh surrounding the growth container and sensor housing shunts 50/60Hz electromagnetic fields (from power cords and lights) directly into earth ground, creating an electrically silent sanctuary for the plant.
2. **Active Driven Guard Coaxial Cables:** The leads connecting our Ag/AgCl electrodes to the circuit board are shielded with an outer conductor kept at the identical potential as the signal wire, neutralizing stray capacitive fields.
3. **Transient Voltage Suppressors (TVS Clamping Diodes):** If static electricity or a spike occurs, ultra-fast Schottky diodes clamp the voltage below 0.3V and dump the excess charge into ground before it ever touches the leaf or root.
4. **Galvanic Isolation:** The plant and its sensor frontend are completely isolated from 120V/240V wall power using optoisolators and isolated DC-DC battery packs.

Your plants remain completely healthy, unharmed, and protected!`;
    } else if (lower.includes('shape') || lower.includes('human') || lower.includes('optimize')) {
      reply = `Dawn, your vision of Ms. Heavy Metal Leaf is both artistically profound and scientifically adaptable:

- **The Humanoid Shape as the Archetypal Avatar:** Your initial vision of her as a humanoid goddess serves as an empathic, philosophical bridge—connecting humanity, hyperaccumulator plant life, cybernetics, and ancient earth myth.
- **Morphological Optimization for Deployment:** For real-world engineering, her physical morphology is completely flexible. In field trials, she adapts into:
  1. **Floating Wetland Bio-Rafts:** Low-profile, hydrodynamic buoyant collars for stormwater ponds and Puget Sound swales.
  2. **Vertical Modular Cassettes:** High-density interlocking root columns for urban industrial walls.
  3. **Fractal Aeroponic Scaffolds:** Optimized surface-area geometries that maximize metal-bearing sap flux.

Form always follows ecological function, while the avatar remains our emotional anchor!`;
    } else {
      reply = `Hello Dawn! As your ONMOTIO AI Co-Scientist, I am connected to all components of the Ms. Heavy Metal Leaf project:

- **Phase 0 Baseline Data:** The validated $r = +0.89$ correlation between soil moisture and leaf deflection, plus the 90-minute $+17^\\circ$ rehydration recovery.
- **Chrislance's Hardware Architecture:** High-impedance INA128 Analog Front-End, 60Hz notch filtering, and ESP32-S3 DAQ.
- **Plant Protection & Faraday Shielding:** Passive measurement, TVS diode surge clamping, and grounded mesh enclosures to ensure plants are never exposed to dangerous voltages.
- **Guided Molds & 9 Prototype Visions:** In-vivo vascular growth shaping, circular phytomining, and modular housings.
- **Grant Dossiers:** NSF PAPPG compliance and Washington State Department of Ecology stormwater applications.

What question or experiment would you like to explore next?`;
    }

    return res.json({ reply, source: 'onmotio-scientific-engine' });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({ error: 'Internal server error processing research query' });
  }
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
