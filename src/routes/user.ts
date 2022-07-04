import { User } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';
import _ from 'lodash';
import { ObjectId } from 'bson';
import Fuse from 'fuse.js'
import bcrypt from 'bcrypt'
import { userInfo } from 'os';


const saltround = 10


const Users = Type.Object({
	user_id: Type.String(),
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),
})
type Users = Static<typeof Users>;


const UserWithoutId = Type.Object({
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),
});
type UserWithoutId = Static<typeof UserWithoutId>;

const PartialUser = Type.Partial(Users);
type PartialUser = Static<typeof UserWithoutId>;


const UserParams = Type.Object({
	user_id: Type.String(),
});
type UserParams = Static<typeof UserParams>;

const GetUsersQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetUsersQuery = Static<typeof GetUsersQuery>;



export default async function (server: FastifyInstance) {}
	// server.route({
	// 	method: 'POST',
	// 	url: '/user/create',
	// 	schema: {
	// 		summary: 'Creates new user',
	// 		tags: ['user'],
	// 		body: UserWithoutId,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const user = request.body as any
	// 		const encryptedPassword = bcrypt.hashSync(user.password, saltround)
	// 		return await prismaClient.user.create({
	// 			data: {
	// 				...user,
	// 				password:encryptedPassword
	// 			}
	// 		})
	// 	},
	// }); 
	// server.route({
	// 	method: 'PUT',
	// 	url: '/user',
	// 	schema: {
	// 		summary: 'Creates new user + all properties are required',
	// 		tags: ['user'],
	// 		body: Users,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const user = request.body as User;
	// 		if (!ObjectId.isValid(user.user_id)) {
	// 			reply.badRequest('user_id should be an ObjectId!');
	// 		} else {
	// 			return await prismaClient.user.upsert({
	// 				where: { user_id: user.user_id },
	// 				create: user,
	// 				update: _.omit(user, ['user_id']),
	// 			});
	// 		}
	// 	},
	// });
	// server.route({
	// 	method: 'PATCH',
	// 	url: '/user/:user_id',
	// 	schema: {
	// 		summary: 'Update a user by id + you dont need to pass all properties',
	// 		tags: ['user'],
	// 		body: PartialUser,
	// 		params: UserParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { user_id } = request.params as UserParams;
	// 		if (!ObjectId.isValid(user_id)) {
	// 			reply.badRequest('user_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		const user = request.body as any;

	// 		return prismaClient.user.update({
	// 			where: { user_id },
	// 			data: user,
	// 		});
	// 	},
	// });

	// server.route({
	// 	method: 'DELETE',
	// 	url: '/user/:user_id',
	// 	schema: {
	// 		summary: 'Deletes a user',
	// 		tags: ['user'],
	// 		params: UserParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { user_id } = request.params as UserParams;
	// 		if (!ObjectId.isValid(user_id)) {
	// 			reply.badRequest('user_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		return prismaClient.user.delete({
	// 			where: { user_id },
	// 		});
	// 	},
	// });

	// server.route({
	// 	method: 'GET',
	// 	url: '/user/:user_id',
	// 	schema: {
	// 		summary: 'Returns one user or null',
	// 		tags: ['user'],
	// 		params: UserParams,
	// 		response: {
	// 			'2xx': Type.Union([Users, Type.Null()]),
	// 		},
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { user_id } = request.params as UserParams;
	// 		if (!ObjectId.isValid(user_id)) {
	// 			reply.badRequest('contact_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		return prismaClient.user.findFirst({
	// 			where: { user_id },
	// 		});
	// 	},
	// });

// 	server.route({
// 		method: 'GET',
// 		url: '/user',
// 		schema: {
// 			summary: 'Gets all users',
// 			tags: ['user'],
// 			querystring: GetUsersQuery,
// 			response: {
// 				'2xx': Type.Array(Users),
// 			},
// 		},
// 		handler: async (request, reply) => {
// 			const query = request.query as GetUsersQuery;

// 			const users = await prismaClient.user.findMany();
// 			if (!query.text) return users;

// 			const fuse = new Fuse(users, {
// 				includeScore: true,
// 				isCaseSensitive: false,
// 				includeMatches: true,
// 				findAllMatches: true,
// 				keys: ['username', 'email'],
// 			});


// 			const result: User[] = fuse.search(query.text).map((r) => r.item);
// 			return result;
// 		},
// 	});
   

// }