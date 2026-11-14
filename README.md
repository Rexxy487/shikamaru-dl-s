# Shikamaru PDF417 Studio

A browser-based PDF417 barcode toolkit built with Next.js, React, and TypeScript. Barcode generation, scanning, and saved history run locally in your browser.

## Features

- Live PDF417, PDF417 Compact, and MicroPDF417 generation
- Editable text, driver license, boarding pass, shipping, ticket, vCard, and JSON templates
- Configurable error correction, dimensions, colors, rotation, and labels
- Barcode preview, metrics, and image/SVG/PDF export
- Batch barcode generation and sheet exports
- Scan barcodes from images or a camera and load decoded data into the generator
- Local barcode history and a built-in PDF417 reference guide

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

Camera scanning requires browser permission and a secure context (HTTPS or localhost). No barcode payloads are sent to a server by the app.
