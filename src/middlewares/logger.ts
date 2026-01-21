import type { Context, Next } from "hono";

// ANSI Color Codes
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";

const getStatusColor = (status: number) => {
    if (status >= 500) return RED;
    if (status >= 400) return YELLOW;
    if (status >= 300) return CYAN;
    if (status >= 200) return GREEN;
    return RESET;
};

// Define the custom middleware
export const customLoggerMiddleware = async (c: Context, next: Next) => {
    const start = performance.now();
    await next();
    const end = performance.now();
    const responseTime = end - start;

    const status = c.res.status;
    const method = c.req.method.padEnd(7);
    const path = c.req.path;
    const color = getStatusColor(status);

    console.log(
        `${BOLD}[API]${RESET} ${method} ${path} ${color}${status}${RESET} - ${responseTime.toFixed(2)}ms`
    );
};