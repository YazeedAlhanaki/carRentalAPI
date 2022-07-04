import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { prismaClient } from "../prisma";
import { Car } from '@prisma/client';
import { FastifyInstance } from "fastify";

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
const CarParams = Type.Object({
	car_id: Type.String(),
});
type CarParams = Static<typeof CarParams>;

export default async function (server: FastifyInstance) {
server.route({
    method: 'GET',
    url: '/cars/:car_id',
    schema: {
        summary: 'Returns one car or null',
        tags: ['cars'],
        params: CarParams,
        response: {
            '2xx': Type.Union([Car, Type.Null()]),
        },
    },
    handler: async (request, reply) => {
        const { car_id } = request.params as CarParams;
        if (!ObjectId.isValid(car_id)) {
            reply.badRequest('car_id should be an ObjectId!');
            return;
        }
        return prismaClient.car.findFirst({
            where: { car_id },
        });
    },
});}