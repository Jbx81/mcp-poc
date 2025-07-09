import * as readline from "node:readline";
import { stdin, stdout } from "node:process";

const drinks = [
    {
        name: "Latte",
        price: 5,
        description:
          "A latte is a coffee drink made with espresso and steamed milk.",
      },
      {
        name: "Mocha",
        price: 6,
        description: "A mocha is a coffee drink made with espresso and chocolate.",
      },
      {
        name: "Flat White",
        price: 7,
        description:
          "A flat white is a coffee drink made with espresso and steamed milk.",
      }, 
];

const serverInfo = {
    name: "Coffee Shop Server",
    version: "1.0.0",
};

const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    });

function sendResponse(id: number, result: object) {
    const response = {
        result,
        jsonrpc: "2.0",
        id,
    };
    console.log(JSON.stringify(response));
}

(async function main () {
    for await (const line of rl) {
        try {
            const json = JSON.parse(line);
            if (json.jsonrpc === "2.0") {
                if (json.method === "initialize"){
                    sendResponse(json.id, {
                        protocolVersion: "2025-07-09",
                        capabilities: {
                            tools: { listChanged: true},
                    }, serverInfo,})
                }
            }
        } catch (error) 
        {
            console.error("Invalid JSON:", error);
        }
    }
})();