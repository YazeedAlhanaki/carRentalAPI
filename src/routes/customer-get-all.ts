import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { Customer } from '@prisma/client';
import { prismaClient } from "../prisma";
import Fuse from "fuse.js";
import { addAuthorization, verifyToken } from '../hooks/auth';


const Customer = Type.Object({
    customer_id: Type.String(),
    customer_name: Type.String(),
    customer_age: Type.Number(),
    customer_credentials: Type.Number(),
    customer_contact: Type.Number()
});
const GetCustomerQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetCustomerQuery = Static<typeof GetCustomerQuery>;
export default async function (server: FastifyInstance) {
    addAuthorization(server);

server.route({
    method: 'GET',
    url: '/customer',
    schema: {
        summary: 'Gets all customers',
        tags: ['customer'],
        querystring: GetCustomerQuery,
        response: {
            '2xx': Type.Array(Customer),
        },
    },
    handler: async (request, reply) => {
        const query = request.query as GetCustomerQuery;

        const customers = await prismaClient.customer.findMany();
        if (!query.text) return customers;

        const fuse = new Fuse(customers, {
            includeScore: true,
            isCaseSensitive: false,
            keys: ['customer_name'],
        });


        const result: Customer[] = fuse.search(query.text).map((r) => r.item);
        return result;
    },
});}