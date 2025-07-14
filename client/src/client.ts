import * as readline from "node:readline/promises";
import { spawn } from "node:child_process";

(async function main() {
    const serverProcess = spawn("node", ["../server/dist/index.js"],{
        stdio: ["pipe","pipe", "inherit"],
    })
    const rl = readline.createInterface({
        input: serverProcess.stdout,
        output: undefined,
    });
    let lastId = 0;

    async function send(
        method: string,
        params: object = {},
        isNotification?: boolean
    ){
    serverProcess.stdin.write(
        JSON.stringify({
            jsonrpc: "2.0",
            method,
            params,
            id: isNotification ? undefined : lastId++,
        }) + "\n"
    );
    if (isNotification) {
        return;
    }
    const json = await rl.question("");
    return JSON.parse(json).result;
    }

    const out = await send("initialize", {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "diy-client", version: "0.1.0" },
    });
    console.log(out);
})();