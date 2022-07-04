import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { prismaClient } from "../prisma";

const CarParams = Type.Object({
	car_id: Type.String(),
});
type CarParams = Static<typeof CarParams>;

export default async function (server: FastifyInstance) {
server.route({
    method: 'DELETE',
    url: '/cars/:car_id',
    schema: {
        summary: 'Deletes a car',
        tags: ['cars'],
        params: CarParams,
    },
    handler: async (request, reply) => {
        const { car_id } = request.params as CarParams;
        if (!ObjectId.isValid(car_id)) {
            reply.badRequest('contact_id should be an ObjectId!');
            return;
        }

        return prismaClient.car.delete({
            where: { car_id },
        });
    },
});}