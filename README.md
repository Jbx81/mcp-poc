# MCP Server Boilerplate

A comprehensive boilerplate for creating Model Context Protocol (MCP) servers using Node.js with stdio transport.

## Features

- **Tools**: Example implementations for echo, time, and calculation tools
- **Resources**: Server information and status resources
- **Prompts**: Greeting and concept explanation prompts
- **Error Handling**: Robust error handling throughout
- **Stdio Transport**: Uses stdio for communication with MCP clients

## Installation

```bash
npm install
```

## Usage

### Starting the Server

```bash
npm start
```

or

```bash
node server.js
```

### Example Tools

1. **Echo Tool**: Echoes back input text
2. **Get Time Tool**: Returns current date/time in various formats
3. **Calculate Tool**: Performs basic arithmetic calculations

### Example Resources

1. **Server Info**: Basic server information
2. **Server Status**: Current server status and statistics

### Example Prompts

1. **Greeting**: Generate personalized greetings
2. **Explain Concept**: Generate explanations for concepts

## Development

The server uses ES modules and requires Node.js 18+.

### File Structure

```
├── server.js          # Main server implementation
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

### Extending the Server

To add new tools, modify the `setupToolHandlers()` method:

```javascript
// Add to ListToolsRequestSchema handler
{
  name: 'my_tool',
  description: 'My custom tool',
  inputSchema: {
    type: 'object',
    properties: {
      // Define your parameters here
    },
    required: ['param1'],
  },
}

// Add to CallToolRequestSchema handler
case 'my_tool':
  // Your tool implementation
  return {
    content: [
      {
        type: 'text',
        text: 'Tool result',
      },
    ],
  };
```

## MCP Protocol

This server implements the Model Context Protocol (MCP) specification, enabling:

- **Bidirectional communication** between client and server
- **Capability negotiation** for tools, resources, and prompts
- **Structured data exchange** with JSON-RPC 2.0
- **Error handling** with proper error responses

## Testing

You can test the server using any MCP-compatible client or the MCP CLI tools.

## License

MIT