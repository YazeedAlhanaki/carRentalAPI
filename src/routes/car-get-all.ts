import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import Fuse from "fuse.js";
import { prismaClient } from "../prisma";
import { Car } from '@prisma/client';
import { addAuthorization } from "../hooks/auth";

 const Car = Type.Object({
	car_id: Type.String(),
	carName: Type.String(),
	carBrand: Type.String(),
	color: Type.String(),
	capacity: Type.Number(),
	model: Type.Number(),
	price: Type.Number(),
    is_booked: Type.Boolean(),
});
const GetCarQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetCarQuery = Static<typeof GetCarQuery>;
export default async function (server: FastifyInstance) {
    addAuthorization(server);
	server.route({
		method: 'GET',
		url: '/cars',
		schema: {
			summary: 'Gets all cars',
			tags: ['cars'],
			querystring: GetCarQuery,
			response: {
				'2xx': Type.Array(Car),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetCarQuery;

			const cars = await prismaClient.car.findMany();
			if (!query.text) return cars;

			const fuse = new Fuse(cars, {
				includeScore: true,
				isCaseSensitive: false,
				keys: ['carName'],
			});


			const result: Car[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});}