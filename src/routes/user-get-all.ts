import { User } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import Fuse from "fuse.js";
import { addAuthorization } from "../hooks/auth";
import { prismaClient } from "../prisma";
const Users = Type.Object({
	user_id: Type.String(),
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),
})
type Users = Static<typeof Users>;

const GetUsersQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetUsersQuery = Static<typeof GetUsersQuery>;

export default async function (server: FastifyInstance) {
    addAuthorization(server);

    server.route({
		method: 'GET',
		url: '/user',
		schema: {
			summary: 'Gets all users',
			tags: ['user'],
			querystring: GetUsersQuery,
			response: {
				'2xx': Type.Array(Users),
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
				keys: ['username', 'email'],
			});


			const result: User[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});
   

}
