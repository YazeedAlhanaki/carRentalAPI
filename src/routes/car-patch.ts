import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { addAuthorization } from "../hooks/auth";
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

const PartialcarWithoutId = Type.Partial(CartWithoutId);
type PartialcarWithoutId = Static<typeof PartialcarWithoutId>;

const CarParams = Type.Object({
	car_id: Type.String(),
});
type CarParams = Static<typeof CarParams>;


export default async function (server: FastifyInstance) {
    addAuthorization(server);

server.route({
    method: 'PATCH',
    url: '/cars/:car_id',
    schema: {
        summary: 'Update a car by id + you dont need to pass all properties',
        tags: ['cars'],
        body: PartialcarWithoutId,
        params: CarParams,
    },
    handler: async (request, reply) => {
        const { car_id } = request.params as CarParams;
        if (!ObjectId.isValid(car_id)) {
            reply.badRequest('car_id should be an ObjectId!');
            return;
        }

        const car = request.body as PartialcarWithoutId;

        return prismaClient.car.update({
            where: { car_id },
            data: car,
        });
    },
});}