import { User } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user';
import { prismaClient } from '../prisma';
import _ from 'lodash';
import { ObjectId } from 'bson';
import Fuse from 'fuse.js'


// const user = Type.Object({
// 	id: Type.String({  $id: 'user' }),
// 	username: Type.String(),
// 	email: Type.String(),
// 	password: Type.String(),
// 	// role: Type.String()
// });
// type user = Static<typeof user>;

// export let users: user[] = [];


// const Role = Type.Object({
// 	ADMIN: Type.String(),
// 	USER: Type.String()
// })

const User = Type.Object({
	user_id: Type.String(),
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),
	role: Type.String()
})

type User = Static<typeof User>;

const UserWithoutId = Type.Object({
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),
	role: Type.String()
});
type UserWithoutId = Static<typeof UserWithoutId>;

const PartialUser = Type.Partial(User);
type PartialUser = Static<typeof UserWithoutId>;


const UserParams = Type.Object({
	user_id: Type.String(),
});
type UserParams = Static<typeof UserParams>;

const GetUsersQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetUsersQuery = Static<typeof GetUsersQuery>;



export default async function (server: FastifyInstance) {
	server.route({
		method: 'POST',
		url: '/user',
		schema: {
			summary: 'Creates new user + all properties are required',
			tags: ['user'],
			body: UserWithoutId,
		},
		handler: async (request, reply) => {
			const user = request.body as UserWithoutId
			return await prismaClient.user.create({
				data: user,
			})
			// return prismaClient.user.findMany();
		},
	}); 
	server.route({
		method: 'PUT',
		url: '/user',
		schema: {
			summary: 'Creates new contact + all properties are required',
			tags: ['user'],
			body: User,
		},
		handler: async (request, reply) => {
			const user = request.body as User;
			if (!ObjectId.isValid(user.user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
			} else {
				return await prismaClient.user.upsert({
					where: { user_id: user.user_id },
					create: user,
					update: _.omit(user, ['user_id']),
				});
			}
		},
	});
	server.route({
		method: 'PATCH',
		url: '/user/:user_id',
		schema: {
			summary: 'Update a user by id + you dont need to pass all properties',
			tags: ['user'],
			body: PartialUser,
			params: UserParams,
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as UserParams;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
				return;
			}

			const user = request.body as PartialUser;

			return prismaClient.user.update({
				where: { user_id },
				data: user,
			});
		},
	});

	server.route({
		method: 'DELETE',
		url: '/user/:user_id',
		schema: {
			summary: 'Deletes a user',
			tags: ['user'],
			params: UserParams,
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as UserParams;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
				return;
			}

			return prismaClient.user.delete({
				where: { user_id },
			});
		},
	});

	server.route({
		method: 'GET',
		url: '/user/:user_id',
		schema: {
			summary: 'Returns one user or null',
			tags: ['user'],
			params: UserParams,
			response: {
				'2xx': Type.Union([User, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as UserParams;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('contact_id should be an ObjectId!');
				return;
			}

			return prismaClient.user.findFirst({
				where: { user_id },
			});
		},
	});

	server.route({
		method: 'GET',
		url: '/user',
		schema: {
			summary: 'Gets all users',
			tags: ['users'],
			querystring: GetUsersQuery,
			response: {
				'2xx': Type.Array(User),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetUsersQuery;

			const users = await prismaClient.user.findMany();
			if (!query.text) return users;

			const fuse = new Fuse(users, {
				includeScore: true,
				isCaseSensitive: false,
				includeMatches: true,
				findAllMatches: true,
				threshold: 1,
				keys: ['username', 'email'],
			});


			const result: User[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});
    // server.route({
	// 	method: 'PATCH',
	// 	url: '/user/:id',
	// 	schema: {
	// 		summary: 'Update a user by id + you dont need to pass all properties',
	// 		tags: ['user'],
	// 		body: Type.Partial(user),
	// 		params: Type.Object({
	// 			id: Type.String({ format: 'uuid' }),
	// 		}),
	// 	},
	// 	handler: async (request, reply) => {
	// 		const newuser: any = request.body;
	// 		return userController(users, newuser);
	// 	},
	// });

    // server.route({
	// 	method: 'GET',
	// 	url: '/users/:id',
	// 	schema: {
	// 		summary: 'Returns one users or null',
	// 		tags: ['users'],
	// 		params: Type.Object({
	// 			id: Type.String({ format: 'uuid' }),
	// 		}),
	// 		response: {
	// 			'2xx': Type.Union([user, Type.Null()]),
	// 		},
	// 	},
	// 	handler: async (request, reply) => {
	// 		const id = (request.params as any).id as string;

	// 		return users.find((c) => c.id === id) ?? null;
	// 	},
	// });

}