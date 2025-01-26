'use server'

// import {AtomaSDK} from "atoma-sdk";

// export async function run() {
//     // console.log(process.env.ATOMA_KEY, process.env.ATOMA_MODEL);
//     const atomaSDK = new AtomaSDK({
//         bearerAuth: process.env.ATOMA_KEY
//     });
//     const result = await atomaSDK.chat.create({
//         messages: [
//             {
//                 role: "user",
//                 content: "Hello!"
//             }
//         ],
//         model: process.env.ATOMA_MODEL!
//     });
//     console.log(result);
// }

type ResponseType = {
    choices: {
        message: {
            content: string
        }
    }[]
}

const developerContent =
`You can only choose from [0, 1, 2].
Please predict the least likely and most likely numbers to choose in next time, the two numbers cannot be the same.
Separate them with spaces and output them, no specific analysis and thinking process is required.`;

export async function run(historicalData: string): Promise<ResponseType> {
    const res = await fetch("https://api.atoma.network/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.ATOMA_KEY}`
        },
        body: JSON.stringify({
            model: process.env.ATOMA_MODEL,
            messages: [
                {
                    role: "developer",
                    content: developerContent
                },
                {
                    role: "user",
                    content: historicalData
                }],
        })
    });
    return res.json();
}