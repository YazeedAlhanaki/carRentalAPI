import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { prismaClient } from "../prisma";
import { Customer } from '@prisma/client';
const Customer = Type.Object({
    customer_id: Type.String(),
    customer_name: Type.String(),
    customer_age: Type.Number(),
    customer_credentials: Type.Number(),
    customer_contact: Type.Number()
});
const CustomerParams = Type.Object({
	customer_id: Type.String(),
});
type CustomerParams = Static<typeof CustomerParams>;

export default async function (server: FastifyInstance) {
server.route({
    method: 'GET',
    url: '/customer/:customer_id',
    schema: {
        summary: 'Returns one customer or null',
        tags: ['customer'],
        params: CustomerParams,
        response: {
            '2xx': Type.Union([Customer, Type.Null()]),
        },
    },
    handler: async (request, reply) => {
        const { customer_id } = request.params as CustomerParams;
        if (!ObjectId.isValid(customer_id)) {
            reply.badRequest('customer_id should be an ObjectId!');
            return;
        }

        return prismaClient.customer.findFirst({
            where: { customer_id },
        });
    },
});}