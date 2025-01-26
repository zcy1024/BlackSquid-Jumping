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

export async function run(): Promise<ResponseType> {
    const res = await fetch("https://api.atoma.network/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.ATOMA_KEY}`
        },
        body: JSON.stringify({
            model: process.env.ATOMA_MODEL,
            messages: [{
                role: "user",
                content: "Please choose two different numbers in [0, 1, 2], and just reply me these two numbers."
            }],
            max_tokens: 128,
        })
    });
    return res.json();
}