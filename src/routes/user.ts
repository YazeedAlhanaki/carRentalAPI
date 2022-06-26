import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user';

const user = Type.Object({
	id: Type.String({ format: 'uuid',  $id: 'user'  }),
	name: Type.String(),
	password: Type.String(),
});
type user = Static<typeof user>;

export let users: user[] = [];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/user',
		schema: {
			summary: 'Creates new user + all properties are required',
			tags: ['user'],
			body: user,
		},
		handler: async (request, reply) => {
			const newuser: any = request.body;
			return userController(users, newuser);
		},
	}); 
    server.route({
		method: 'PATCH',
		url: '/user/:id',
		schema: {
			summary: 'Update a user by id + you dont need to pass all properties',
			tags: ['users'],
			body: Type.Partial(user),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newuser: any = request.body;
			return userController(users, newuser);
		},
	});

    server.route({
		method: 'GET',
		url: '/users/:id',
		schema: {
			summary: 'Returns one users or null',
			tags: ['users'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([user, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return users.find((c) => c.id === id) ?? null;
		},
	});

}