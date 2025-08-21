import fastify from 'fastify';
import crypto from 'node:crypto';

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
})

const courses = [
    { id: "1", title: 'Curso, de Node.js' },
    { id: "2", title: 'Curso, de React' },
    { id: "3", title: 'Curso, de React Native' },
]

server.get('/courses', () => {
    return courses
})

server.get('/courses/:id', (req, res) => {
    type Params = {
        id: string
    }

    const params = req.params as Params
    const courseId = params.id

    const course = courses.find(course => course.id === courseId)

    if (course) {
        return { course }
    }

    return res.status(404).send()
})

server.post('/courses', (req, res) => {
    type Body = {
        title: string
    }

    const body = req.body as Body
    const courseTitle = body.title

    const courseId = crypto.randomUUID()
    if (!courseTitle) {
        return res.status(400).send({ message: "Titulo obrigatório" })
    }
    courses.push({ id: courseId, title: "Novo Curso" })

    return res.status(201).send({ courseId })
})

server.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running')
})