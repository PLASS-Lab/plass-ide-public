export interface ProblemContent {
    number: string;
    type: string;
    question: string;
    answer: string;
}

export interface Problem {
    id: number;
    name: string;
    content?: string;
    input?: string;
    output?: string;
    rank: number;
    remarks?: string;
    created: string;
    category: string;
    isSolve?: boolean;
    testCases?: Array<TestCase>;
}

export interface TestCase {
    input: string;
    output: string;
}

export interface AccordionEvent {
    index: number;
    originalEvent: MouseEvent;
}

export interface File {
    name: string;
    isDirectory: boolean;
    open?: boolean;
    path: string;
    ext?: string;
    size?: number;
    files?: Array<File>;
    data?: string;
    modify?: boolean;
    isTemp?: boolean;
    isDelete?: boolean;
}

export interface Project {
    id: number;
    name: string;
    category: string;
    created: string;
    path: string;
    enabled: number;
    files?: Array<File>;
    select?: boolean;
    problem?: number;
}