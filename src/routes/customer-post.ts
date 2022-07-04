import { Static, Type } from "@sinclair/typebox";
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


export default async function (server: FastifyInstance) {
    addAuthorization(server);
    server.route({
		method: 'POST',
		url: '/customer',
		schema: {
			summary: 'Creates new customer',
			tags: ['customer'],
			body: CustomerwithoutId,
		},
		handler: async (request, reply) => {
			const customer = request.body as CustomerwithoutId;
			return await prismaClient.customer.create({
				data: customer,
			});
		},
	});
}