import fastify from 'fastify';
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform
}
  from 'fastify-type-provider-zod';
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { createCoursesRoute } from './src/routes/create-course.ts';
import { getCoursesRoute } from './src/routes/get-courses.ts';
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts';

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
}).withTypeProvider<ZodTypeProvider>()

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Desafio Node",
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)



server.register(createCoursesRoute)
server.register(getCoursesRoute)
server.register(getCourseByIdRoute)



server.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running')
})