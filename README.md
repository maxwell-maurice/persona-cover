# Persona Cover

A Chrome extension designed to help you maintain privacy on social media by obscuring your typical posting patterns. This extension allows you to define a "cover" persona—a set of characteristics and interests that differ from your real ones—and then automatically modifies your posts to align with that persona. You can create multiple personas or use a random one to keep consistincy with one social media app, or switch between them to keep algorithms guessing.

## Features

- **Persona Definition**: Set up a cover persona with custom traits (e.g., interests, tone, posting frequency).
- **Post Modification**: The extension intercepts your posts and alters them to match your cover persona.
- **Pattern Obscurity**: By presenting a different persona, the extension helps hide your true behavioral patterns from algorithms and observers.

## Getting Started

### Prerequisites

- Any browser
- Basic understanding of browser extensions

### Installation

1.  **Clone the repository** (or download the source code).
2.  **Open Chrome** and navigate to `chrome://extensions`.
3.  **Enable Developer mode** by toggling the switch in the top-right corner.
4.  Click the **"Load unpacked"** button.
5.  Select the `persona-cover` directory you just downloaded.

The extension should now appear in your extensions list and toolbar.

## Usage

1.  Click the **Persona Cover icon** in your browser toolbar.
2.  Configure your **cover persona** settings.
3.  Start browsing and posting on social media. The extension will automatically modify your posts.

## Development

This extension uses the standard Chrome extension architecture:

- `manifest.json`: Defines the extension's properties and permissions.
- `popup.html` / `popup.js`: The user interface for configuring the extension.
- `content.js`: Injects scripts into web pages to modify content.
- `background.js`: Handles background logic and browser events.

## License

MIT
