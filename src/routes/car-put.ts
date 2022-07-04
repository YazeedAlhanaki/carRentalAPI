import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import _ from "lodash";
import { prismaClient } from "../prisma";
import { Car } from '@prisma/client';
import { Type } from "@sinclair/typebox";
import { addAuthorization } from "../hooks/auth";

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

export default async function (server: FastifyInstance) {
    addAuthorization(server);

server.route({
    method: 'PUT',
    url: '/cars',
    schema: {
        summary: 'Creates new car + all properties are required',
        tags: ['cars'],
        body: Car,
    },
    handler: async (request, reply) => {
        const car = request.body as Car;
        if (!ObjectId.isValid(car.car_id)) {
            reply.badRequest('car_id should be an ObjectId!');
        } else {
            return await prismaClient.car.upsert({
                where: { car_id: car.car_id },
                create: car,
                update: _.omit(car, ['car_id']),
            });
        }
    },
});}