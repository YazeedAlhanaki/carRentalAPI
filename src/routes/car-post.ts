import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { prismaClient } from "../prisma";

const CartWithoutId = Type.Object({
	carName: Type.String(),
	carBrand: Type.String(),
	color: Type.String(),
	capacity: Type.Number(),
	model: Type.Number(),
	price: Type.Number(),
    is_booked: Type.Boolean(),
})
type CartWithoutId = Static<typeof CartWithoutId>;
export default async function (server: FastifyInstance) {
server.route({
    method: 'POST',
    url: '/cars',
    schema: {
        summary: 'Creates new car',
        tags: ['cars'],
        body: CartWithoutId,
    },
    handler: async (request, reply) => {
        const car = request.body as CartWithoutId;
        return await prismaClient.car.create({
            data: car,
        });
    },
});}