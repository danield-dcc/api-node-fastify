import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from '../factories/make-course.ts'
import { makeAuthenticatedUser } from '../factories/make-user.ts'


test('get course by id', async () => {
	await server.ready()

	const { token } = await makeAuthenticatedUser('student')
	const course = await makeCourse()

	const response = await request(server.server)
		.get(`/courses/${course.id}`)
		.set('Authorization', token)

	expect(response.status).toEqual(200)
	expect(response.body).toEqual({
		course: {
			id: expect.any(String),
			title: expect.any(String),
			description: null,
		}
	})
})

test('return 404 for non existing courses', async () => {
	await server.ready()

	const { token } = await makeAuthenticatedUser('student')

	const response = await request(server.server)
		.get(`/courses/0198d8a6-bec8-794b-8ae3-8f319a9b9191`)
		.set('Authorization', token)


	expect(response.status).toEqual(404)
})

