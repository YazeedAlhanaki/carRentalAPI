import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { prismaClient } from "../prisma";

const RentalWithoutId = Type.Object({
	user_id: Type.String(),
	returnDate: Type.String({format:"date-time"}),
	car_id: Type.String(),
	customer_id: Type.String()
});
type RentalWithoutId = Static<typeof RentalWithoutId>;


export default async function (server: FastifyInstance) {
    server.route({
		method: 'POST',
		url: '/rentals',
		schema: {
			summary: 'Creates new rental',
			tags: ['rental'],
			body: RentalWithoutId,
		},
		handler: async (request, reply) => {
			const rental = request.body as RentalWithoutId;
			return await prismaClient.rental.create({
				data: rental,
			});
		},
	});
}