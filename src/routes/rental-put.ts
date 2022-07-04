import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import _ from "lodash";
import { addAuthorization } from "../hooks/auth";
import { prismaClient } from "../prisma";

const Rentals = Type.Object({
	rental_id : Type.String(),
	user_id: Type.String(),
	returnDate: Type.String({format:"date-time"}),
	car_id: Type.String(),
	customer_id: Type.String()
});
type Rentals = Static<typeof Rentals>;


export default async function (server: FastifyInstance) {
    addAuthorization(server);

    server.route({
		method: 'PUT',
		url: '/rentals',
		schema: {
			summary: 'Creates new rental + all properties are required',
			tags: ['rental'],
			body: Rentals,
		},
		handler: async (request, reply) => {
			const rental = request.body as Rentals;
			if (!ObjectId.isValid(rental.rental_id)) {
				reply.badRequest('rental_id should be an ObjectId!');
			} else {
				return await prismaClient.rental.upsert({
					where: { rental_id: rental.rental_id },
					create: rental,
					update: _.omit(rental, ['rental_id']),
				});
			}
		},
	});
}