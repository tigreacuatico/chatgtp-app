import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration) // instance of openai

const app = express()

// middlewares
app.use(cors()) // allows us to make crossover requests and allow our server to be called from the frontend
app.use(express.json()) // pass json from the frontend to the backend

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX'
    })
})

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        })

        // send back the response to the frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error })
    }
})
// higher temperature value --> the model will take more risks
// max_tokens at 3000 --> pretty long responses
// frequency_penalty --> if you ask the same question again, is less likely to say a similar thing

// make sure the server always listens to our requests
app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))