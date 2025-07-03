# GitHub Actions Secrets Setup

To use OpenAI API in GitHub Actions, you need to add your API key as a repository secret:

1. Go to your repository: https://github.com/jaystarz1/jaystarz1.github.io
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions" in the left sidebar
4. Click "New repository secret"
5. Add:
   - Name: `OPENAI_API_KEY`
   - Value: [Your OpenAI API key]
6. Click "Add secret"

This keeps your API key secure and allows GitHub Actions to use it.

## Local Development

For local testing, rename `env-file` to `.env` and add your API key:
```
mv env-file .env
```

The .env file is already in .gitignore so it won't be committed.