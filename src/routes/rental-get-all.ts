import { Static, Type } from "@sinclair/typebox";
import { Rental } from '@prisma/client';
import { FastifyInstance } from "fastify";
import Fuse from "fuse.js";
import { prismaClient } from "../prisma";
import { addAuthorization } from "../hooks/auth";
const Rental = Type.Object({
	rental_id : Type.String(),
	user_id: Type.String(),
	returnDate: Type.String({format:"date-time"}),
	car_id: Type.String(),
	customer_id: Type.String()
});
const GetRentalsQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetRentalsQuery = Static<typeof GetRentalsQuery>;

export default async function (server: FastifyInstance) {
    addAuthorization(server);

    server.route({
		method: 'GET',
		url: '/rentals',
		schema: {
			summary: 'Gets all rentals',
			tags: ['rental'],
			querystring: GetRentalsQuery,
			response: {
				'2xx': Type.Array(Rental),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetRentalsQuery;

			const rentals = await prismaClient.rental.findMany();
			if (!query.text) return rentals;

			const fuse = new Fuse(rentals, {
				includeScore: true,
				isCaseSensitive: false,
				includeMatches: true,
				findAllMatches: true,
				threshold: 1,
				keys: ['returnDate', 'rentalDate'],
			});


			const result: Rental[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});
}
