import * as express from "express";
import connection from "../../connection";

const getProblems = async (req: express.Request, res: express.Response) => {
    const unit = req.query.unit || 10;
    const page = req.query.page || 0;

    const [rows] = await connection.execute("SELECT * FROM problems LIMIT ?, ?", [page * unit, unit]);

    res
        .status(200)
        .json({
            problems: rows
        });
};

const getProblem = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;

    const [rows] = await connection.execute(
        "SELECT p.id, p.name, p.content, p.remarks, p.input as inputContent , p.output as outputContent, p.rank, \
         p.category, p.created, t.input, t.output \
        FROM problems as p LEFT JOIN testCases as t on p.id = t.problem  WHERE p.id = ?"
        , [id]);

    if(rows.length == 0) {
        res.status(400).send();
        return;
    }
    
    let result = {
        testCases: []
    };

    rows.forEach( (row) => {
        if ( !result.hasOwnProperty("id") ) {
            result["id"] = row.id; result["name"] = row.name; result["content"] = row.content; 
            result["remarks"] = row.remarks; result["input"] = row.inputContent; result["output"] = row.outputContent;
            result["rank"] = row.rank; result["created"] = row.created; result["category"] = row.category;
        }
        const testCase = {
            input: row.input,
            output: row.output
        };
        result.testCases.push(testCase);
    });

    console.log(result);

    res
        .status(200)
        .json(result);
};

export const problemEndPoint = {
    getProblems,
    getProblem,
};
