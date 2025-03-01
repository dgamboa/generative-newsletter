# LLM Newsletter Generator

## Quick Description
A Next.js-powered application leveraging large language models (LLMs) to automatically generate personalized daily newsletters based on configurable prompts. Users can review, edit, and send the final newsletter draft directly from the platform, with emails formatted to look professional and visually appealing.

## Target Audience
* Subject matter experts who want to share curated insights in their field
* Users at startups or knowledge-driven businesses needing daily synthesized updates.
* Content creators looking to automate high-quality newsletters.

## User Needs
* Automate the generation of daily newsletters customized by configurable prompts.
* Have newsletters follow a standardized, consistent, professional format.
* Ensure newsletters look visually appealing when received via email.
* Ability to easily review, edit, and send newsletters from a single platform.
* Control the timing of when newsletters are dispatched.

## Core Features

### Automated Newsletter Drafting
* Utilize an LLM (GPT-4o) to generate daily newsletters based on a standard user-defined prompt saved as a configuration file in the codebase.
* Pre-defined, standard newsletter template to maintain consistency and quality.

### Draft Review & Send Control
* Interface to review and refine generated newsletter content.
* Rich text editor to allow users to easily adjust content and formatting including a preview of what the newsletter will look like in an email.
* A simple “Send Now” button for immediate dispatch after review and editing.

### Email Integration
* Generate visually appealing HTML emails optimized for readability across devices.
* A simple “Send Now” button for immediate dispatch after review and editing.

## App Architecture

### Frontend
* Next.js application with React components
* Tailwind CSS for responsive styling
* Rich text editor integration
* User authentication system that uses Clerk
* Real-time preview rendering of email format

### Backend
* Next.js API routes for server-side functionality
* Configuration file describing what the newsletter is about and how the LLM should structure its search (e.g. what time period to focus on, types of insights)
* Integration with LLM API (OpenAI GPT-4o) for content generation
* Database for storing:
  * Newsletter drafts
  * Newsletters sent
* Email sending service integration (SendGrid)

### Data Flow
* Developer adjusts the configuration file for newsletter content before deploying the app
* User hits a button to generate a newsletter draft
* System generates draft using LLM based on configuration
* User reviews and edits the newsletter draft
* User adds recipients and triggers sending
* System distributes newsletter to configured recipients
