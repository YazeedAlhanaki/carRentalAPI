export function rentalController(rentals: any[], newRental: any) {
	const rentalIndex = rentals.findIndex((el) => el.id === newRental.id);
	if (rentalIndex === -1) {
		rentals.push(newRental);
	} else {
		rentals[rentalIndex] = {
			...rentals[rentalIndex],
			...newRental,
		};
	}
	return rentals;

    
}