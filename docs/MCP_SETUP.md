# MCP Server Setup Guide

This guide explains how to configure the Model Context Protocol (MCP) servers for the SURef project.

## Overview

The following MCP servers have been configured in `~/.cursor/mcp.json`:

1. **GitHub MCP** - Manage repositories, issues, and pull requests
2. **Supabase MCP** - Query and inspect Supabase database (official Supabase MCP server)
3. **Filesystem MCP** - Navigate and manage project files
4. **npm MCP** - Package management and documentation (note: this project uses `bun` for package management)

## Setup Instructions

### 1. GitHub MCP

**Purpose:** Interact with GitHub repositories, manage issues, and review pull requests.

**Setup:**

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with these scopes:
   - `repo` (full control of private repositories)
   - `read:org` (if you need organization access)
3. Copy the token and replace `YOUR_GITHUB_TOKEN_HERE` in `~/.cursor/mcp.json`

**Alternative:** You can also use `@upstash/github-mcp` if preferred.

### 2. Supabase MCP

**Purpose:** Execute SQL queries, inspect your Supabase database schema, and manage Supabase resources.

**Setup:**

The Supabase MCP uses the official remote MCP server and is already configured for your project. No additional setup is required!

**Authentication:**

1. When you first use the Supabase MCP, Cursor will prompt you to authenticate
2. A browser window will open where you can log in to your Supabase account
3. Grant organization access to the MCP client
4. The MCP server uses dynamic client registration, so no personal access token (PAT) is needed

**Configuration:**

The MCP is configured to scope to your specific project (`opxrguskxuogghzcnppk`). The configuration in `~/.cursor/mcp.json` looks like:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=opxrguskxuogghzcnppk"
    }
  }
}
```

**Security Best Practices:**

- **Never connect to production data** - Use the MCP server with development projects only
- **Read-only mode** - Consider enabling read-only mode if you must connect to real data
- **Project scoping** - Already configured to limit access to your specific project
- **Manual approval** - Always review tool calls before executing them in Cursor

For more details, see the [official Supabase MCP documentation](https://supabase.com/docs/guides/getting-started/mcp).

### 3. Filesystem MCP

**Purpose:** Navigate and manage files within the project directory.

**Setup:**

- No additional setup required! The filesystem MCP is already configured to work with `/Users/jarvis/Code/suindex`
- This allows the AI to read and write files more efficiently

### 4. npm MCP

**Purpose:** Check package versions, read package documentation, and manage dependencies.

**Setup:**

1. Create an npm token (optional, only needed for private packages):
   - Run: `npm token create --read-only`
   - Or visit: https://www.npmjs.com/settings/[your-username]/tokens
2. Replace `YOUR_NPM_TOKEN_HERE` in `~/.cursor/mcp.json` (or leave empty if you only need public packages)

**Note:**

- For public packages, you can leave the token empty or remove the env section.
- **This project uses `bun` for package management**, not npm. The npm MCP is still useful for checking package versions and documentation, but actual package operations should be done with `bun` commands.

## After Configuration

1. **Restart Cursor** to apply the MCP server changes
2. **Verify Setup:**
   - Go to Cursor Settings → Features → MCP Servers
   - You should see all configured servers listed
   - Check that they show as active/connected

## Testing MCP Servers

Once configured, you can test the MCPs by asking the AI assistant to:

- **GitHub:** "List open issues in this repository"
- **Supabase:** "Show me the schema for the suentities table" or "Query the pilots table"
- **Filesystem:** "Read the router.tsx file"
- **npm:** "What's the latest version of @chakra-ui/react?"

## Troubleshooting

### MCP Server Not Connecting

1. Check that all tokens/keys are correctly set in `~/.cursor/mcp.json`
2. Verify JSON syntax is valid (no trailing commas)
3. Restart Cursor completely
4. Check Cursor's MCP server logs in Settings → Features → MCP Servers

### Supabase MCP Connection Issues

- Ensure you've authenticated through the browser prompt when first using the MCP
- Verify the project reference (`opxrguskxuogghzcnppk`) is correct in the URL
- Check that your Supabase account has access to the project
- If authentication fails, try restarting Cursor and authenticating again
- For CI environments, you may need to use a personal access token (see [Supabase MCP docs](https://supabase.com/docs/guides/getting-started/mcp#manual-authentication))

### GitHub Token Permissions

- Ensure your token has the necessary scopes
- If you get permission errors, regenerate the token with more permissions

## Security Notes

- **Never commit `~/.cursor/mcp.json` to version control** - it contains sensitive tokens
- Consider using environment variables for tokens (if the MCP server supports it)
- Rotate tokens periodically for security
- Use read-only tokens when possible (especially for database access)

## Optional: Environment Variables

For better security, you can use environment variables instead of hardcoding tokens. Update `~/.cursor/mcp.json` to reference environment variables:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@smithery/github-mcp"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

Then set the environment variables in your shell profile (`~/.zshrc` or `~/.bashrc`).
