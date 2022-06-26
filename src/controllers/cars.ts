export function carsController(cars: any[], newCar: any) {
	const carIndex = cars.findIndex((el) => el.id === newCar.id);
	if (carIndex === -1) {
		cars.push(newCar);
	} else {
		cars[carIndex] = {
			...cars[carIndex],
			...newCar,
		};
	}
	return cars;

    
}