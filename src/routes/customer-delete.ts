import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { prismaClient } from "../prisma";

const CustomerParams = Type.Object({
	customer_id: Type.String(),
});
type CustomerParams = Static<typeof CustomerParams>;

export default async function (server: FastifyInstance) {
server.route({
    method: 'DELETE',
    url: '/customer/:customer_id',
    schema: {
        summary: 'Deletes a customer',
        tags: ['customer'],
        params: CustomerParams,
    },
    handler: async (request, reply) => {
        const { customer_id } = request.params as CustomerParams;
        if (!ObjectId.isValid(customer_id)) {
            reply.badRequest('contact_id should be an ObjectId!');
            return;
        }

        return prismaClient.customer.delete({
            where: { customer_id },
        });
    },
});}