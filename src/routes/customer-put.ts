import { Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import _ from "lodash";
import { Customer } from '@prisma/client';
import { prismaClient } from "../prisma";
import { addAuthorization } from "../hooks/auth";

const Customer = Type.Object({
    customer_id: Type.String(),
    customer_name: Type.String(),
    customer_age: Type.Number(),
    customer_credentials: Type.Number(),
    customer_contact: Type.Number()
   
});

export default async function (server: FastifyInstance) {
    addAuthorization(server);

server.route({
    method: 'PUT',
    url: '/customer',
    schema: {
        summary: 'Creates new customer + all properties are required',
        tags: ['customer'],
        body: Customer,
    },
    handler: async (request, reply) => {
        const customer = request.body as Customer;
        if (!ObjectId.isValid(customer.customer_id)) {
            reply.badRequest('customer_id should be an ObjectId!');
        } else {
            return await prismaClient.customer.upsert({
                where: { customer_id: customer.customer_id },
                create: customer,
                update: _.omit(customer, ['customer_id']),
            });
        }
    },
});}