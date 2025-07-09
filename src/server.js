#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class MCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'mcp-server-boilerplate',
        version: '1.0.0',
        description: 'A boilerplate MCP server with stdio transport',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
    this.setupPromptHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'echo',
            description: 'Echo back the input text',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Text to echo back',
                },
              },
              required: ['text'],
            },
          },
          {
            name: 'get_time',
            description: 'Get current date and time',
            inputSchema: {
              type: 'object',
              properties: {
                format: {
                  type: 'string',
                  description: 'Format for the time (iso, locale, or timestamp)',
                  enum: ['iso', 'locale', 'timestamp'],
                  default: 'iso',
                },
              },
            },
          },
          {
            name: 'calculate',
            description: 'Perform basic arithmetic calculations',
            inputSchema: {
              type: 'object',
              properties: {
                expression: {
                  type: 'string',
                  description: 'Mathematical expression to evaluate (e.g., "2 + 3 * 4")',
                },
              },
              required: ['expression'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'echo':
            return {
              content: [
                {
                  type: 'text',
                  text: `Echo: ${args.text}`,
                },
              ],
            };

          case 'get_time':
            const now = new Date();
            let timeString;
            
            switch (args.format) {
              case 'locale':
                timeString = now.toLocaleString();
                break;
              case 'timestamp':
                timeString = now.getTime().toString();
                break;
              case 'iso':
              default:
                timeString = now.toISOString();
                break;
            }

            return {
              content: [
                {
                  type: 'text',
                  text: `Current time (${args.format || 'iso'}): ${timeString}`,
                },
              ],
            };

          case 'calculate':
            try {
              // Simple evaluation - in production, use a proper math parser
              const result = Function(`"use strict"; return (${args.expression})`)();
              return {
                content: [
                  {
                    type: 'text',
                    text: `Result: ${args.expression} = ${result}`,
                  },
                ],
              };
            } catch (error) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `Error evaluating expression: ${error.message}`,
                  },
                ],
                isError: true,
              };
            }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  setupResourceHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'server://info',
            mimeType: 'text/plain',
            name: 'Server Information',
            description: 'Basic information about this MCP server',
          },
          {
            uri: 'server://status',
            mimeType: 'application/json',
            name: 'Server Status',
            description: 'Current server status and statistics',
          },
        ],
      };
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'server://info':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/plain',
                text: `MCP Server Boilerplate
Version: 1.0.0
Description: A boilerplate MCP server with stdio transport
Node.js Version: ${process.version}
Platform: ${process.platform}
Started: ${new Date().toISOString()}`,
              },
            ],
          };

        case 'server://status':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  status: 'running',
                  uptime: process.uptime(),
                  memory: process.memoryUsage(),
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });
  }

  setupPromptHandlers() {
    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: 'greeting',
            description: 'Generate a greeting message',
            arguments: [
              {
                name: 'name',
                description: 'Name to greet',
                required: true,
              },
              {
                name: 'style',
                description: 'Greeting style (formal, casual, enthusiastic)',
                required: false,
              },
            ],
          },
          {
            name: 'explain_concept',
            description: 'Generate an explanation for a concept',
            arguments: [
              {
                name: 'concept',
                description: 'Concept to explain',
                required: true,
              },
              {
                name: 'audience',
                description: 'Target audience (beginner, intermediate, advanced)',
                required: false,
              },
            ],
          },
        ],
      };
    });

    // Handle prompt requests
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'greeting':
          const style = args?.style || 'casual';
          let greeting;

          switch (style) {
            case 'formal':
              greeting = `Good day, ${args.name}. I hope you are well.`;
              break;
            case 'enthusiastic':
              greeting = `Hey there, ${args.name}! Great to see you! 🎉`;
              break;
            case 'casual':
            default:
              greeting = `Hi ${args.name}! How's it going?`;
              break;
          }

          return {
            description: `${style} greeting for ${args.name}`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: greeting,
                },
              },
            ],
          };

        case 'explain_concept':
          const audience = args?.audience || 'beginner';
          const concept = args.concept;

          return {
            description: `Explain ${concept} for ${audience} audience`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Please explain the concept of "${concept}" in a way that a ${audience} would understand. Include examples and practical applications where relevant.`,
                },
              },
            ],
          };

        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    });
  }

  async start() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      // Log to stderr so it doesn't interfere with the MCP protocol
      console.error('MCP Server started successfully');
      console.error('Server name:', this.server.name);
      console.error('Server version:', this.server.version);
      console.error('Listening on stdio...');
      
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      process.exit(1);
    }
  }
}

// Start the server
const server = new MCPServer();
server.start().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});