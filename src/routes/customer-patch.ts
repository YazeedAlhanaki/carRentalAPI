import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { addAuthorization } from "../hooks/auth";
import { prismaClient } from "../prisma";
const CustomerwithoutId = Type.Object({
    customer_name: Type.String(),
    customer_age: Type.Number(),
    customer_credentials: Type.Number(),
    customer_contact: Type.Number()
   
});
type CustomerwithoutId = Static<typeof CustomerwithoutId>;
const PartialcustomerWithoutId = Type.Partial(CustomerwithoutId);
type PartialcustomerWithoutId = Static<typeof PartialcustomerWithoutId>;

const CustomerParams = Type.Object({
	customer_id: Type.String(),
});
type CustomerParams = Static<typeof CustomerParams>;

export default async function (server: FastifyInstance) {
    addAuthorization(server);

server.route({
    method: 'PATCH',
    url: '/customer/:customer_id',
    schema: {
        summary: 'Update a customer by id + you dont need to pass all properties',
        tags: ['customer'],
        body: PartialcustomerWithoutId,
        params: CustomerParams,
    },
    handler: async (request, reply) => {
        const { customer_id } = request.params as CustomerParams;
        if (!ObjectId.isValid(customer_id)) {
            reply.badRequest('customer_id should be an ObjectId!');
            return;
        }

        const customer = request.body as PartialcustomerWithoutId;

        return prismaClient.customer.update({
            where: { customer_id },
            data: customer,
        });
    },
});}