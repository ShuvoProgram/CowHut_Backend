import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import router from './app/routes'

import cookieParser from 'cookie-parser'
import httpStatus from 'http-status'

const app: Application = express()

app.use(cors())
app.use(cookieParser())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Application routes
app.use('/api/v1', router)

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Digital Cow Hut! 🐮");
});

//global error handler
app.use(globalErrorHandler)

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})

export default app
