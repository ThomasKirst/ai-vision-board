# Project "AI Vision Board"

This project is a vision board that allows users to generate AI images based on prompts.

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```
REPLICATE_API_TOKEN=r8_... # Enter your Replicate API token here
REPLICATE_MODEL=black-forest-labs/flux-dev # Enter your Replicate model here
```

## Database

The database is a SQLite database. It is stored in the `prompts.sqlite` file.
