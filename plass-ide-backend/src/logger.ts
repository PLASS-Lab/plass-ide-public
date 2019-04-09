export const logger = (tokens, req, res) => {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset() * 60000;

    const dateWithTimezone = new Date(date.getTime() - timezoneOffset).toISOString().substring(0, 19).replace("T", " ");
    const timezone = date.toString().split(" ")[5];

    let statusWIthColor = "";
    switch (tokens.status(req, res).substring(0, 1)) {
        case "1":
        case "2":
            statusWIthColor = `\x1b[32m${tokens.status(req, res)}\x1b[0m`;
            break;
        case "3":
            statusWIthColor = `\x1b[36m${tokens.status(req, res)}\x1b[0m`;
            break;
        case "4":
        case "5":
            statusWIthColor = `\x1b[31m${tokens.status(req, res)}\x1b[0m`;
            break;
        default:
            statusWIthColor = tokens.status(req, res);
    }

    const headers = req.headers;

    const headerString = Object.keys(headers)
        .map(value => `${value}: ${typeof req.headers[value] === "string" ? "\"" : ""}${req.headers[value]}${typeof req.headers[value] === "string" ? "\"" : ""}`)
        .join(", ");

    const body = req.body;

    const bodyString = Object.keys(body)
        .map(value => `${value}: ${typeof req.body[value] === "string" ? "\"" : ""}${req.body[value]}${typeof req.body[value] === "string" ? "\"" : ""}`)
        .join(", ");

    return [
        `\x1b[95m${dateWithTimezone} ${timezone}\x1b[0m`,
        `[from ${tokens["remote-addr"](req, res)}]`,
        tokens.method(req, res),
        tokens.url(req, res),
        statusWIthColor,
        `Headers: { ${headerString} }`,
        `Body: { ${bodyString} }`,
        `(${tokens["response-time"](req, res)}ms)`,
    ].join(" ");
};
