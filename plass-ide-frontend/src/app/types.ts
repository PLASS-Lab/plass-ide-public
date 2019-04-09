export interface ProblemContent {
    number: string;
    type: string;
    question: string;
    answer: string;
}

export interface Problem {
    number: string;
    type: string;
    question: string;
    answer: string;
}

export interface AccordionEvent {
    index: number;
    originalEvent: MouseEvent;
}
