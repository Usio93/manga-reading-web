// mockComments.ts
export interface MockReply {
    id: number;
    content: string;
}

export interface MockComment {
    id: number;
    content: string;
    replies: MockReply[];
}

export const mockComments: MockComment[] = [
    {
        id: 1,
        content: "This chapter is amazing!",
        replies: [
            { id: 101, content: "Totally agree!" },
            { id: 102, content: "Loved the twist." }
        ]
    },
    {
        id: 2,
        content: "Why is the MC so OP?",
        replies: [{ id: 103, content: "Because plot armor 😅" }]
    },
    {
        id: 3,
        content: "Can't wait for the next update!",
        replies: []
    },
];
